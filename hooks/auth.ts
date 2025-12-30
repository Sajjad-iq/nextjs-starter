import { useAuthStore } from '@/stores/auth';
import { authService } from '@/services/authService';

interface AuthActionsReturn {
    login: (emailOrPhone: string, password: string) => Promise<any>;
    register: (
        name: string,
        email: string,
        phoneCode: string,
        phone: string,
        password: string
    ) => Promise<any>;
    logout: () => Promise<void>;
}

/**
 * Auth Actions Hook
 * Provides authentication actions that integrate with the auth store
 */
export function useAuthActions(): AuthActionsReturn {
    const authStore = useAuthStore();

    const login = async (emailOrPhone: string, password: string) => {
        try {
            const result = await authService.login(emailOrPhone, password);

            if (result.success && result.data) {
                // Set user in store
                authStore.setUser(result.data.user);
            }

            return result;
        } catch (error) {
            console.error('[useAuthActions] Login error:', error);
            throw error;
        }
    };

    const register = async (
        name: string,
        email: string,
        phoneCode: string,
        phone: string,
        password: string
    ) => {
        try {
            const result = await authService.register(name, email, phoneCode, phone, password);
            return result;
        } catch (error) {
            console.error('[useAuthActions] Register error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            authStore.clearSession();
        } catch (error) {
            console.error('[useAuthActions] Logout error:', error);
            throw error;
        }
    };

    return {
        login,
        register,
        logout,
    };
}
