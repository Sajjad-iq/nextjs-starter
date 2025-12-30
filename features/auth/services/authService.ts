import { httpService } from '@/lib/config/http';
import type { User, ApiResponse } from '@/types/global';

interface LoginResponse {
    user: User;
    token: string;
}

// Storage keys (for client-side state only)
const TOKEN_KEY = 'auth_token';
const CURRENT_USER_KEY = 'current_user';

/**
 * Authentication service using Next.js API routes
 * Cookies are set by the server via HTTP response headers
 */
export const authService = {
    /**
     * Login with email/phone and password
     */
    async login(emailOrPhone: string, password: string): Promise<ApiResponse<LoginResponse>> {
        try {
            const axios = httpService.getAxiosInstance();
            const response = await axios.post('/auth/login', {
                emailOrPhone,
                password,
            });

            const { data } = response.data;

            if (data?.user && data?.token) {
                // Store in localStorage for client-side state
                // Cookies are automatically set by the API response
                localStorage.setItem(TOKEN_KEY, data.token);
                localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
            }

            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed',
                errorCode: 'LOGIN_ERROR',
            };
        }
    },

    /**
     * Register new user
     */
    async register(
        name: string,
        email: string,
        phone: string,
        password: string
    ): Promise<ApiResponse> {
        try {
            const axios = httpService.getAxiosInstance();
            const response = await axios.post('/auth/register', {
                name,
                email,
                phone,
                password,
            });

            const { data } = response.data;

            if (data?.user && data?.token) {
                // Store in localStorage for client-side state
                // Cookies are automatically set by the API response
                localStorage.setItem(TOKEN_KEY, data.token);
                localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
            }

            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed',
                errorCode: 'REGISTER_ERROR',
            };
        }
    },

    /**
     * Logout
     */
    async logout(): Promise<ApiResponse> {
        try {
            const axios = httpService.getAxiosInstance();
            const response = await axios.post('/auth/logout');

            // Clear localStorage
            // Cookies are automatically deleted by the API response
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(CURRENT_USER_KEY);

            return response.data;
        } catch (error: any) {
            // Even if API fails, clear local storage
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(CURRENT_USER_KEY);

            return {
                success: true,
                message: 'Logged out successfully',
            };
        }
    },

    /**
     * Get current user
     */
    getCurrentUser(): User | null {
        if (typeof window === 'undefined') return null;

        const token = localStorage.getItem(TOKEN_KEY);
        const userStr = localStorage.getItem(CURRENT_USER_KEY);

        if (!token || !userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },
};
