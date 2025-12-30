import type { ReactNode } from 'react';
import { useAuthStore } from '@/stores/auth';

interface PermissionGuardProps {
  permission: string;
  children: ReactNode;
}

/**
 * PermissionGuard Component
 *
 * Conditionally renders children based on user permissions.
 * Only shows content if the user has the required permission.
 *
 * @param permission - The permission string to check (e.g., "organization:create")
 * @param children - The content to render if permission is granted
 */
export function PermissionGuard({ permission, children }: PermissionGuardProps) {
  const user = useAuthStore((state) => state.user);

  // Check if user has the required permission
  const hasPermission = user?.permissions?.includes(permission) || false;

  // Only render children if user has permission
  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
}
