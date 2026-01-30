'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, usePermissions } from '@/contexts/AuthContext';
import type { SystemModule, PermissionAction, ProtectedRouteProps } from '@/types/auth';
import { Loader2, ShieldAlert, Lock } from 'lucide-react';

// ============================================
// Loading Component
// ============================================
function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-500 mx-auto" />
        <p className="mt-4 text-slate-600">Carregando...</p>
      </div>
    </div>
  );
}

// ============================================
// Access Denied Component
// ============================================
interface AccessDeniedProps {
  message?: string;
  showLogin?: boolean;
}

function AccessDenied({ message = 'Você não tem permissão para acessar esta página.', showLogin = false }: AccessDeniedProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center max-w-md px-4">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-slate-900">Acesso Negado</h1>
        <p className="mt-2 text-slate-600">{message}</p>
        <div className="mt-6 flex gap-3 justify-center">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Voltar
          </button>
          {showLogin && (
            <button
              onClick={() => router.push('/auth/login')}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
            >
              Fazer Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// ProtectedRoute - Requer autenticação
// ============================================
export function ProtectedRoute({ children, fallback, redirectTo = '/auth/login' }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && redirectTo) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  if (loading) {
    return fallback ?? <AuthLoading />;
  }

  if (!user) {
    return fallback ?? <AccessDenied message="Você precisa estar logado para acessar esta página." showLogin />;
  }

  return <>{children}</>;
}

// ============================================
// ModuleGuard - Requer acesso ao módulo
// ============================================
interface ModuleGuardProps extends ProtectedRouteProps {
  module: SystemModule;
}

export function ModuleGuard({ children, module, fallback, redirectTo }: ModuleGuardProps) {
  const { user, loading } = useAuth();
  const { hasModule } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return fallback ?? <AuthLoading />;
  }

  if (!user) {
    return fallback ?? <AccessDenied showLogin />;
  }

  if (!hasModule(module)) {
    if (redirectTo) {
      router.push(redirectTo);
      return fallback ?? <AuthLoading />;
    }
    return fallback ?? <AccessDenied message={`Você não tem acesso ao módulo ${module.toUpperCase()}.`} />;
  }

  return <>{children}</>;
}

// ============================================
// PermissionGuard - Requer permissão específica
// ============================================
interface PermissionGuardProps extends ProtectedRouteProps {
  module: SystemModule;
  action: PermissionAction;
  resource?: string;
}

export function PermissionGuard({ children, module, action, resource, fallback, redirectTo }: PermissionGuardProps) {
  const { user, loading } = useAuth();
  const { hasPermission } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return fallback ?? <AuthLoading />;
  }

  if (!user) {
    return fallback ?? <AccessDenied showLogin />;
  }

  if (!hasPermission(module, action, resource)) {
    if (redirectTo) {
      router.push(redirectTo);
      return fallback ?? <AuthLoading />;
    }
    return fallback ?? (
      <AccessDenied 
        message={`Você não tem permissão para ${action} em ${module.toUpperCase()}${resource ? ` (${resource})` : ''}.`} 
      />
    );
  }

  return <>{children}</>;
}

// ============================================
// AdminGuard - Requer role admin
// ============================================
interface AdminGuardProps extends ProtectedRouteProps {
  module?: SystemModule;
}

export function AdminGuard({ children, module, fallback, redirectTo }: AdminGuardProps) {
  const { user, loading } = useAuth();
  const { isAdmin } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return fallback ?? <AuthLoading />;
  }

  if (!user) {
    return fallback ?? <AccessDenied showLogin />;
  }

  if (!isAdmin(module)) {
    if (redirectTo) {
      router.push(redirectTo);
      return fallback ?? <AuthLoading />;
    }
    return fallback ?? (
      <AccessDenied 
        message={module 
          ? `Você precisa ser administrador do módulo ${module.toUpperCase()}.`
          : 'Você precisa ser administrador para acessar esta página.'
        } 
      />
    );
  }

  return <>{children}</>;
}

// ============================================
// SuperAdminGuard - Requer superadmin
// ============================================
export function SuperAdminGuard({ children, fallback, redirectTo }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const { isSuperAdmin } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return fallback ?? <AuthLoading />;
  }

  if (!user) {
    return fallback ?? <AccessDenied showLogin />;
  }

  if (!isSuperAdmin()) {
    if (redirectTo) {
      router.push(redirectTo);
      return fallback ?? <AuthLoading />;
    }
    return fallback ?? (
      <AccessDenied message="Esta área é restrita a Super Administradores." />
    );
  }

  return <>{children}</>;
}

// ============================================
// Componentes Condicionais (Show/Hide)
// ============================================

// Mostrar apenas se tiver permissão
interface ShowIfProps {
  children: React.ReactNode;
  module?: SystemModule;
  action?: PermissionAction;
  resource?: string;
  admin?: boolean;
  superadmin?: boolean;
  fallback?: React.ReactNode;
}

export function ShowIf({ 
  children, 
  module, 
  action, 
  resource, 
  admin, 
  superadmin,
  fallback = null 
}: ShowIfProps) {
  const { hasModule, hasPermission, isAdmin, isSuperAdmin } = usePermissions();

  // Superadmin check
  if (superadmin && !isSuperAdmin()) {
    return <>{fallback}</>;
  }

  // Admin check
  if (admin && !isAdmin(module)) {
    return <>{fallback}</>;
  }

  // Module check
  if (module && !hasModule(module)) {
    return <>{fallback}</>;
  }

  // Permission check
  if (module && action && !hasPermission(module, action, resource)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Esconder se tiver permissão
export function HideIf(props: ShowIfProps) {
  return (
    <ShowIf {...props} fallback={props.children}>
      {props.fallback}
    </ShowIf>
  );
}

// ============================================
// Hook para verificar permissão em ações
// ============================================
export function useCanPerform() {
  const { hasPermission, isAdmin, isSuperAdmin } = usePermissions();

  return {
    canCreate: (module: SystemModule, resource?: string) => hasPermission(module, 'create', resource),
    canRead: (module: SystemModule, resource?: string) => hasPermission(module, 'read', resource),
    canUpdate: (module: SystemModule, resource?: string) => hasPermission(module, 'update', resource),
    canDelete: (module: SystemModule, resource?: string) => hasPermission(module, 'delete', resource),
    canExport: (module: SystemModule, resource?: string) => hasPermission(module, 'export', resource),
    canApprove: (module: SystemModule, resource?: string) => hasPermission(module, 'approve', resource),
    canAdmin: (module?: SystemModule) => isAdmin(module),
    canSuperAdmin: () => isSuperAdmin(),
  };
}
