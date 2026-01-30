-- ============================================
-- ness.OS - RBAC Schema para Supabase
-- ============================================
-- Níveis: superadmin > adm-area > user-area
-- ============================================

-- ============================================
-- 1. EXTENSÕES
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. ENUMS
-- ============================================

-- Tipos de role
CREATE TYPE user_role AS ENUM ('superadmin', 'adm-area', 'user-area');

-- Módulos do sistema
CREATE TYPE system_module AS ENUM ('fin', 'ops', 'growth', 'jur', 'gov', 'people', 'admin');

-- Ações permitidas
CREATE TYPE permission_action AS ENUM ('create', 'read', 'update', 'delete', 'export', 'approve');

-- ============================================
-- 3. TABELAS
-- ============================================

-- Perfil do usuário (extensão do auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nome TEXT NOT NULL,
  avatar_url TEXT,
  telefone TEXT,
  cargo TEXT,
  
  -- Role global
  role user_role NOT NULL DEFAULT 'user-area',
  
  -- Status
  ativo BOOLEAN DEFAULT true,
  primeiro_acesso BOOLEAN DEFAULT true,
  ultimo_acesso TIMESTAMPTZ,
  
  -- Preferências
  preferencias JSONB DEFAULT '{
    "tema": "light",
    "idioma": "pt-BR",
    "notificacoes_email": true,
    "notificacoes_push": true
  }'::jsonb,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Permissões por módulo (para adm-area e user-area)
CREATE TABLE public.user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Módulo
  modulo system_module NOT NULL,
  
  -- Ações permitidas neste módulo
  acoes permission_action[] NOT NULL DEFAULT '{read}',
  
  -- Recursos específicos (NULL = todos do módulo)
  -- Ex: ['contratos', 'alertas'] para FIN
  recursos TEXT[],
  
  -- Restrições adicionais (JSONB flexível)
  -- Ex: {"apenas_proprio_departamento": true, "cliente_ids": ["uuid1", "uuid2"]}
  restricoes JSONB DEFAULT '{}',
  
  -- Período de validade (opcional)
  valido_de DATE,
  valido_ate DATE,
  
  -- Metadados
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id),
  
  -- Unique por usuário/módulo
  UNIQUE(user_id, modulo)
);

-- Log de ações (auditoria)
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  
  -- Ação
  acao TEXT NOT NULL,
  modulo system_module,
  recurso TEXT,
  recurso_id UUID,
  
  -- Dados
  dados_antes JSONB,
  dados_depois JSONB,
  
  -- Contexto
  ip_address INET,
  user_agent TEXT,
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Sessões ativas (opcional, para controle)
CREATE TABLE public.active_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Sessão
  session_token TEXT NOT NULL,
  device_info JSONB,
  ip_address INET,
  
  -- Validade
  expires_at TIMESTAMPTZ NOT NULL,
  last_activity TIMESTAMPTZ DEFAULT now(),
  
  -- Status
  ativo BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 4. ÍNDICES
-- ============================================

CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_ativo ON public.profiles(ativo);
CREATE INDEX idx_profiles_email ON public.profiles(email);

CREATE INDEX idx_user_permissions_user ON public.user_permissions(user_id);
CREATE INDEX idx_user_permissions_modulo ON public.user_permissions(modulo);

CREATE INDEX idx_audit_log_user ON public.audit_log(user_id);
CREATE INDEX idx_audit_log_modulo ON public.audit_log(modulo);
CREATE INDEX idx_audit_log_created ON public.audit_log(created_at DESC);

CREATE INDEX idx_active_sessions_user ON public.active_sessions(user_id);
CREATE INDEX idx_active_sessions_expires ON public.active_sessions(expires_at);

-- ============================================
-- 5. FUNÇÕES AUXILIARES
-- ============================================

-- Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para profiles
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 6. FUNÇÕES DE RBAC
-- ============================================

-- Obter role do usuário atual
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Verificar se é superadmin
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
      AND role = 'superadmin'
      AND ativo = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Verificar se é admin de área (ou superior)
CREATE OR REPLACE FUNCTION public.is_admin(p_modulo system_module DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  v_role user_role;
BEGIN
  SELECT role INTO v_role FROM public.profiles WHERE id = auth.uid() AND ativo = true;
  
  -- Superadmin tem acesso a tudo
  IF v_role = 'superadmin' THEN
    RETURN true;
  END IF;
  
  -- Adm-area precisa ter permissão no módulo específico
  IF v_role = 'adm-area' AND p_modulo IS NOT NULL THEN
    RETURN EXISTS (
      SELECT 1 FROM public.user_permissions
      WHERE user_id = auth.uid()
        AND modulo = p_modulo
        AND (valido_ate IS NULL OR valido_ate >= CURRENT_DATE)
    );
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Verificar permissão específica
CREATE OR REPLACE FUNCTION public.has_permission(
  p_modulo system_module,
  p_acao permission_action,
  p_recurso TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_role user_role;
  v_perm RECORD;
BEGIN
  -- Buscar role do usuário
  SELECT role INTO v_role FROM public.profiles WHERE id = auth.uid() AND ativo = true;
  
  IF v_role IS NULL THEN
    RETURN false;
  END IF;
  
  -- Superadmin tem todas as permissões
  IF v_role = 'superadmin' THEN
    RETURN true;
  END IF;
  
  -- Buscar permissão no módulo
  SELECT * INTO v_perm
  FROM public.user_permissions
  WHERE user_id = auth.uid()
    AND modulo = p_modulo
    AND (valido_de IS NULL OR valido_de <= CURRENT_DATE)
    AND (valido_ate IS NULL OR valido_ate >= CURRENT_DATE);
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Verificar se a ação está permitida
  IF NOT (p_acao = ANY(v_perm.acoes)) THEN
    RETURN false;
  END IF;
  
  -- Verificar recurso específico (se definido)
  IF p_recurso IS NOT NULL AND v_perm.recursos IS NOT NULL THEN
    IF NOT (p_recurso = ANY(v_perm.recursos)) THEN
      RETURN false;
    END IF;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Obter módulos permitidos para o usuário
CREATE OR REPLACE FUNCTION public.get_my_modules()
RETURNS system_module[] AS $$
DECLARE
  v_role user_role;
BEGIN
  SELECT role INTO v_role FROM public.profiles WHERE id = auth.uid() AND ativo = true;
  
  -- Superadmin tem acesso a todos
  IF v_role = 'superadmin' THEN
    RETURN ARRAY['fin', 'ops', 'growth', 'jur', 'gov', 'people', 'admin']::system_module[];
  END IF;
  
  -- Retornar módulos com permissão
  RETURN ARRAY(
    SELECT modulo FROM public.user_permissions
    WHERE user_id = auth.uid()
      AND (valido_de IS NULL OR valido_de <= CURRENT_DATE)
      AND (valido_ate IS NULL OR valido_ate >= CURRENT_DATE)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Obter permissões completas do usuário
CREATE OR REPLACE FUNCTION public.get_my_permissions()
RETURNS JSONB AS $$
DECLARE
  v_profile RECORD;
  v_permissions JSONB;
BEGIN
  -- Buscar perfil
  SELECT * INTO v_profile FROM public.profiles WHERE id = auth.uid() AND ativo = true;
  
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;
  
  -- Superadmin retorna permissões totais
  IF v_profile.role = 'superadmin' THEN
    RETURN jsonb_build_object(
      'role', 'superadmin',
      'is_superadmin', true,
      'modules', ARRAY['fin', 'ops', 'growth', 'jur', 'gov', 'people', 'admin'],
      'permissions', jsonb_build_object(
        'fin', jsonb_build_object('actions', ARRAY['create', 'read', 'update', 'delete', 'export', 'approve'], 'resources', null),
        'ops', jsonb_build_object('actions', ARRAY['create', 'read', 'update', 'delete', 'export', 'approve'], 'resources', null),
        'growth', jsonb_build_object('actions', ARRAY['create', 'read', 'update', 'delete', 'export', 'approve'], 'resources', null),
        'jur', jsonb_build_object('actions', ARRAY['create', 'read', 'update', 'delete', 'export', 'approve'], 'resources', null),
        'gov', jsonb_build_object('actions', ARRAY['create', 'read', 'update', 'delete', 'export', 'approve'], 'resources', null),
        'people', jsonb_build_object('actions', ARRAY['create', 'read', 'update', 'delete', 'export', 'approve'], 'resources', null),
        'admin', jsonb_build_object('actions', ARRAY['create', 'read', 'update', 'delete', 'export', 'approve'], 'resources', null)
      )
    );
  END IF;
  
  -- Buscar permissões específicas
  SELECT jsonb_object_agg(
    modulo::text,
    jsonb_build_object(
      'actions', acoes,
      'resources', recursos,
      'restrictions', restricoes
    )
  ) INTO v_permissions
  FROM public.user_permissions
  WHERE user_id = auth.uid()
    AND (valido_de IS NULL OR valido_de <= CURRENT_DATE)
    AND (valido_ate IS NULL OR valido_ate >= CURRENT_DATE);
  
  RETURN jsonb_build_object(
    'role', v_profile.role,
    'is_superadmin', false,
    'is_admin', v_profile.role = 'adm-area',
    'modules', ARRAY(SELECT modulo FROM public.user_permissions WHERE user_id = auth.uid()),
    'permissions', COALESCE(v_permissions, '{}'::jsonb)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;

-- PROFILES --

-- Usuário pode ver seu próprio perfil
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Superadmin pode ver todos
CREATE POLICY "Superadmin can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.is_superadmin());

-- Adm-area pode ver usuários de seus módulos
CREATE POLICY "Admin can view users in their modules"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_permissions up1
      JOIN public.user_permissions up2 ON up1.modulo = up2.modulo
      WHERE up1.user_id = auth.uid()
        AND up2.user_id = profiles.id
        AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'adm-area'
    )
  );

-- Usuário pode atualizar seu próprio perfil (campos limitados)
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Superadmin pode atualizar qualquer perfil
CREATE POLICY "Superadmin can update all profiles"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.is_superadmin());

-- Superadmin pode inserir novos perfis
CREATE POLICY "Superadmin can insert profiles"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (public.is_superadmin());

-- Superadmin pode deletar perfis
CREATE POLICY "Superadmin can delete profiles"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (public.is_superadmin());

-- USER_PERMISSIONS --

-- Usuário pode ver suas próprias permissões
CREATE POLICY "Users can view own permissions"
  ON public.user_permissions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Superadmin pode tudo
CREATE POLICY "Superadmin full access to permissions"
  ON public.user_permissions FOR ALL
  TO authenticated
  USING (public.is_superadmin());

-- Adm-area pode ver/gerenciar permissões de seus módulos
CREATE POLICY "Admin can manage permissions in their modules"
  ON public.user_permissions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_permissions
      WHERE user_id = auth.uid()
        AND modulo = user_permissions.modulo
        AND 'approve' = ANY(acoes)
    )
    AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'adm-area'
  );

-- AUDIT_LOG --

-- Superadmin pode ver todos os logs
CREATE POLICY "Superadmin can view all audit logs"
  ON public.audit_log FOR SELECT
  TO authenticated
  USING (public.is_superadmin());

-- Adm-area pode ver logs de seus módulos
CREATE POLICY "Admin can view logs in their modules"
  ON public.audit_log FOR SELECT
  TO authenticated
  USING (
    modulo IN (SELECT modulo FROM public.user_permissions WHERE user_id = auth.uid())
    AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('adm-area', 'superadmin')
  );

-- Qualquer autenticado pode inserir logs (sistema)
CREATE POLICY "Authenticated can insert audit logs"
  ON public.audit_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ACTIVE_SESSIONS --

-- Usuário vê apenas suas sessões
CREATE POLICY "Users can view own sessions"
  ON public.active_sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Superadmin vê todas
CREATE POLICY "Superadmin can view all sessions"
  ON public.active_sessions FOR ALL
  TO authenticated
  USING (public.is_superadmin());

-- ============================================
-- 8. TRIGGER: CRIAR PROFILE AO REGISTRAR
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'user-area')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger no auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 9. TRIGGER: REGISTRAR AÇÕES NO AUDIT LOG
-- ============================================

CREATE OR REPLACE FUNCTION public.audit_action()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_log (user_id, acao, recurso, recurso_id, dados_depois)
    VALUES (auth.uid(), 'INSERT', TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_log (user_id, acao, recurso, recurso_id, dados_antes, dados_depois)
    VALUES (auth.uid(), 'UPDATE', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_log (user_id, acao, recurso, recurso_id, dados_antes)
    VALUES (auth.uid(), 'DELETE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 10. DADOS INICIAIS
-- ============================================

-- Criar superadmin inicial (ajustar email)
-- Executar após criar o usuário no Auth
/*
INSERT INTO public.profiles (id, email, nome, role)
VALUES (
  'UUID_DO_USUARIO_AUTH',
  'esper@ness.com.br',
  'Ricardo Esper',
  'superadmin'
);
*/

-- ============================================
-- 11. VIEWS ÚTEIS
-- ============================================

-- View de usuários com suas permissões
CREATE VIEW public.vw_users_permissions AS
SELECT 
  p.id,
  p.email,
  p.nome,
  p.role,
  p.ativo,
  p.ultimo_acesso,
  COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'modulo', up.modulo,
        'acoes', up.acoes,
        'recursos', up.recursos
      )
    ) FILTER (WHERE up.id IS NOT NULL),
    '[]'::jsonb
  ) as permissions
FROM public.profiles p
LEFT JOIN public.user_permissions up ON p.id = up.user_id
GROUP BY p.id, p.email, p.nome, p.role, p.ativo, p.ultimo_acesso;

-- View de módulos por usuário
CREATE VIEW public.vw_user_modules AS
SELECT 
  p.id as user_id,
  p.nome,
  p.role,
  CASE 
    WHEN p.role = 'superadmin' THEN 
      ARRAY['fin', 'ops', 'growth', 'jur', 'gov', 'people', 'admin']::system_module[]
    ELSE 
      ARRAY(SELECT modulo FROM public.user_permissions WHERE user_id = p.id)
  END as modules
FROM public.profiles p
WHERE p.ativo = true;
