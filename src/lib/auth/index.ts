// Auth exports
export * from '@/types/auth';
export { AuthProvider, useAuth, usePermissions } from '@/contexts/AuthContext';
export {
  ProtectedRoute,
  ModuleGuard,
  PermissionGuard,
  AdminGuard,
  SuperAdminGuard,
  ShowIf,
  HideIf,
  useCanPerform,
} from '@/components/auth/guards';
