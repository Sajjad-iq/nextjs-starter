import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth';
import { authService } from '../services/authService';

interface LoginCredentials {
    emailOrPhone: string;
    password: string;
}

interface RegisterData {
    name: string;
    email: string;
    phone: string;
    password: string;
}

/**
 * Hook for login mutation
 */
export function useLogin() {
    const router = useRouter();
    const authStore = useAuthStore();

    return useMutation({
        mutationFn: ({ emailOrPhone, password }: LoginCredentials) =>
            authService.login(emailOrPhone, password),
        onSuccess: (result) => {
            if (result.success && result.data) {
                authStore.setUser(result.data.user);
                toast.success(result.message || 'Login successful');
                router.push('/');
            }
        },
        onError: (error: any) => {
            console.error('[useLogin] Login error:', error);
            toast.error(error.message || 'Login failed');
        },
    });
}

/**
 * Hook for register mutation
 */
export function useRegister() {
    const router = useRouter();
    const authStore = useAuthStore();

    return useMutation({
        mutationFn: ({ name, email, phone, password }: RegisterData) =>
            authService.register(name, email, phone, password),
        onSuccess: (result) => {
            if (result.success && result.data) {
                authStore.setUser(result.data.user);
                toast.success(result.message || 'Registration successful!');

                // Redirect after short delay
                setTimeout(() => {
                    router.push('/');
                }, 1500);
            }
        },
        onError: (error: any) => {
            console.error('[useRegister] Register error:', error);
            toast.error(error.message || 'Registration failed');
        },
    });
}

/**
 * Hook for logout mutation
 */
export function useLogout() {
    const authStore = useAuthStore();

    return useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            authStore.clearSession();
            toast.success('Logged out successfully');
        },
        onError: (error: any) => {
            console.error('[useLogout] Logout error:', error);
            toast.error('Logout failed');
        },
    });
}
