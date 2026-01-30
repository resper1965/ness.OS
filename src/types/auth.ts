// ============================================
// ness.OS - Tipos de RBAC
// ============================================

// Roles do sistema
export type UserRole = 'superadmin' | 'adm-area' | 'user-area';

// Módulos disponíveis
export type SystemModule = 'fin' | 'ops' | 'growth' | 'jur' | 'gov' | 'people' | 'admin';

// Ações permitidas
export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'export' | 'approve';

// Perfil do usuário
export interface UserProfile {
  id: string;
  email: string;
  nome: string;
  avatar_url?: string;
  telefone?: string;
  cargo?: string;
  role: UserRole;
  ativo: boolean;
  primeiro_acesso: boolean;
  ultimo_acesso?: string;
  preferencias: UserPreferences;
  created_at: string;
  updated_at: string;
}

// Preferências do usuário
export interface UserPreferences {
  tema: 'light' | 'dark';
  idioma: string;
  notificacoes_email: boolean;
  notificacoes_push: boolean;
}

// Permissão por módulo
export interface UserPermission {
  id: string;
  user_id: string;
  modulo: SystemModule;
  acoes: PermissionAction[];
  recursos?: string[];
  restricoes?: Record<string, unknown>;
  valido_de?: string;
  valido_ate?: string;
  created_at: string;
  created_by?: string;
}

// Permissões completas do usuário (retorno da função get_my_permissions)
export interface UserPermissions {
  role: UserRole;
  is_superadmin: boolean;
  is_admin?: boolean;
  modules: SystemModule[];
  permissions: {
    [key in SystemModule]?: {
      actions: PermissionAction[];
      resources?: string[] | null;
      restrictions?: Record<string, unknown>;
    };
  };
}

// Contexto de autenticação
export interface AuthContextType {
  user: UserProfile | null;
  permissions: UserPermissions | null;
  loading: boolean;
  error: Error | null;
  
  // Métodos
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, nome: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  
  // Helpers de permissão
  hasModule: (modulo: SystemModule) => boolean;
  hasPermission: (modulo: SystemModule, acao: PermissionAction, recurso?: string) => boolean;
  isAdmin: (modulo?: SystemModule) => boolean;
  isSuperAdmin: () => boolean;
}

// Props para componentes de proteção
export interface ProtectedRouteProps {
  children: React.ReactNode;
  module?: SystemModule;
  action?: PermissionAction;
  resource?: string;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

// Labels amigáveis
export const MODULE_LABELS: Record<SystemModule, string> = {
  fin: 'Financeiro',
  ops: 'Operações',
  growth: 'Comercial',
  jur: 'Jurídico',
  gov: 'Governança',
  people: 'Pessoas',
  admin: 'Administração',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  superadmin: 'Super Administrador',
  'adm-area': 'Administrador de Área',
  'user-area': 'Usuário',
};

export const ACTION_LABELS: Record<PermissionAction, string> = {
  create: 'Criar',
  read: 'Visualizar',
  update: 'Editar',
  delete: 'Excluir',
  export: 'Exportar',
  approve: 'Aprovar',
};

// Cores por role
export const ROLE_COLORS: Record<UserRole, string> = {
  superadmin: 'bg-purple-100 text-purple-800',
  'adm-area': 'bg-blue-100 text-blue-800',
  'user-area': 'bg-gray-100 text-gray-800',
};

// Ícones por módulo (Lucide)
export const MODULE_ICONS: Record<SystemModule, string> = {
  fin: 'DollarSign',
  ops: 'Settings',
  growth: 'TrendingUp',
  jur: 'Scale',
  gov: 'Shield',
  people: 'Users',
  admin: 'Lock',
};
