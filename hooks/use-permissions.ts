import { useAuthStore } from '@/stores/auth';

/**
 * usePermissions Hook - Check user permissions
 *
 * Provides methods to check if the current user has specific permissions
 * Permissions are extracted from authStore.user.permissions
 */
export function usePermissions() {
  const user = useAuthStore((state) => state.user);

  /**
   * Check if the current user has a specific permission
   * @param permission - Permission string in format "resource:action" (e.g., "user:create")
   * @returns boolean - true if user has permission, false otherwise
   */
  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) {
      return false;
    }
    return user.permissions.includes(permission);
  };

  /**
   * Check if user has ANY of the provided permissions
   * @param permissions - Array of permission strings
   * @returns boolean - true if user has at least one permission
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user || !user.permissions) {
      return false;
    }
    return permissions.some((permission) => user.permissions.includes(permission));
  };

  /**
   * Check if user has ALL of the provided permissions
   * @param permissions - Array of permission strings
   * @returns boolean - true if user has all permissions
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user || !user.permissions) {
      return false;
    }
    return permissions.every((permission) => user.permissions.includes(permission));
  };

  /**
   * All user permissions
   */
  const userPermissions = user?.permissions || [];

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    userPermissions,
  };
}
