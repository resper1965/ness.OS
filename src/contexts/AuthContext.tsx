'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabase } from '@/lib/supabase/client';
import type {
  UserProfile,
  UserPermissions,
  AuthContextType,
  SystemModule,
  PermissionAction,
} from '@/types/auth';

// Contexto
const AuthContext = createContext<AuthContextType | null>(null);

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = getSupabase();

  // Carregar perfil e permissões
  const loadUserData = useCallback(async (authUser: User) => {
    try {
      // Buscar perfil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError) throw profileError;

      // Buscar permissões via RPC
      const { data: perms, error: permsError } = await supabase
        .rpc('get_my_permissions');

      if (permsError) throw permsError;

      setUser(profile as UserProfile);
      setPermissions(perms as unknown as UserPermissions);

      // Atualizar último acesso (cast: tipos Supabase genéricos)
      await (supabase as any).from('profiles').update({ ultimo_acesso: new Date().toISOString() }).eq('id', authUser.id);

    } catch (err) {
      console.error('Erro ao carregar dados do usuário:', err);
      setError(err as Error);
    }
  }, [supabase]);

  // Inicializar e ouvir mudanças de auth
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          await loadUserData(session.user);
        }
      } catch (err) {
        console.error('Erro na inicialização:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listener de mudanças
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setLoading(true);
          await loadUserData(session.user);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setPermissions(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, loadUserData]);

  // Sign In
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await loadUserData(data.user);
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign Up
  const signUp = async (email: string, password: string, nome: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nome },
        },
      });

      if (error) throw error;

      // Perfil é criado automaticamente pelo trigger
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign Out
  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setPermissions(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset Password
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
  };

  // Update Profile
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('Usuário não autenticado');

    const { error } = await (supabase as any).from('profiles').update(data as object).eq('id', user.id);

    if (error) throw error;

    setUser({ ...user, ...data });
  };

  // === HELPERS DE PERMISSÃO ===

  // Verificar se tem acesso ao módulo
  const hasModule = (modulo: SystemModule): boolean => {
    if (!permissions) return false;
    if (permissions.is_superadmin) return true;
    return permissions.modules.includes(modulo);
  };

  // Verificar permissão específica
  const hasPermission = (
    modulo: SystemModule,
    acao: PermissionAction,
    recurso?: string
  ): boolean => {
    if (!permissions) return false;
    if (permissions.is_superadmin) return true;

    const modulePerm = permissions.permissions[modulo];
    if (!modulePerm) return false;

    // Verificar ação
    if (!modulePerm.actions.includes(acao)) return false;

    // Verificar recurso (se especificado e se há restrição)
    if (recurso && modulePerm.resources) {
      return modulePerm.resources.includes(recurso);
    }

    return true;
  };

  // Verificar se é admin (de um módulo específico ou geral)
  const isAdmin = (modulo?: SystemModule): boolean => {
    if (!permissions) return false;
    if (permissions.is_superadmin) return true;
    if (!permissions.is_admin) return false;

    if (modulo) {
      return hasModule(modulo) && hasPermission(modulo, 'approve');
    }

    return true;
  };

  // Verificar se é superadmin
  const isSuperAdmin = (): boolean => {
    return permissions?.is_superadmin ?? false;
  };

  const value: AuthContextType = {
    user,
    permissions,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    hasModule,
    hasPermission,
    isAdmin,
    isSuperAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}

// Hook simplificado para permissões
export function usePermissions() {
  const { permissions, hasModule, hasPermission, isAdmin, isSuperAdmin } = useAuth();
  
  return {
    permissions,
    hasModule,
    hasPermission,
    isAdmin,
    isSuperAdmin,
    modules: permissions?.modules ?? [],
    role: permissions?.role ?? 'user-area',
  };
}
