import { createBrowserClient } from '@supabase/ssr';

// Tipos do banco de dados (gerar com: npx supabase gen types typescript)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          nome: string;
          avatar_url: string | null;
          telefone: string | null;
          cargo: string | null;
          role: 'superadmin' | 'adm-area' | 'user-area';
          ativo: boolean;
          primeiro_acesso: boolean;
          ultimo_acesso: string | null;
          preferencias: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          nome: string;
          avatar_url?: string | null;
          telefone?: string | null;
          cargo?: string | null;
          role?: 'superadmin' | 'adm-area' | 'user-area';
          ativo?: boolean;
          primeiro_acesso?: boolean;
          ultimo_acesso?: string | null;
          preferencias?: Record<string, unknown>;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      user_permissions: {
        Row: {
          id: string;
          user_id: string;
          modulo: 'fin' | 'ops' | 'growth' | 'jur' | 'gov' | 'people' | 'admin';
          acoes: ('create' | 'read' | 'update' | 'delete' | 'export' | 'approve')[];
          recursos: string[] | null;
          restricoes: Record<string, unknown> | null;
          valido_de: string | null;
          valido_ate: string | null;
          created_at: string;
          created_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['user_permissions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['user_permissions']['Insert']>;
      };
      audit_log: {
        Row: {
          id: string;
          user_id: string | null;
          acao: string;
          modulo: string | null;
          recurso: string | null;
          recurso_id: string | null;
          dados_antes: Record<string, unknown> | null;
          dados_depois: Record<string, unknown> | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['audit_log']['Row'], 'id' | 'created_at'>;
        Update: never;
      };
    };
    Functions: {
      get_my_role: {
        Args: Record<string, never>;
        Returns: 'superadmin' | 'adm-area' | 'user-area';
      };
      is_superadmin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      is_admin: {
        Args: { p_modulo?: 'fin' | 'ops' | 'growth' | 'jur' | 'gov' | 'people' | 'admin' };
        Returns: boolean;
      };
      has_permission: {
        Args: {
          p_modulo: 'fin' | 'ops' | 'growth' | 'jur' | 'gov' | 'people' | 'admin';
          p_acao: 'create' | 'read' | 'update' | 'delete' | 'export' | 'approve';
          p_recurso?: string;
        };
        Returns: boolean;
      };
      get_my_modules: {
        Args: Record<string, never>;
        Returns: ('fin' | 'ops' | 'growth' | 'jur' | 'gov' | 'people' | 'admin')[];
      };
      get_my_permissions: {
        Args: Record<string, never>;
        Returns: Record<string, unknown>;
      };
    };
  };
};

// Criar cliente Supabase para o browser
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Singleton do cliente
let client: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!client) {
    client = createClient();
  }
  return client;
}
