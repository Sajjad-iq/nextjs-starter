import { httpService } from '@/lib/config/http';
import type { User, ApiResponse } from '@/types/global';

interface LoginResponse {
    user: User;
    token: string;
}

export const authService = {
    async login(emailOrPhone: string, password: string): Promise<ApiResponse<LoginResponse>> {
        try {
            const axios = httpService.getAxiosInstance();
            const response = await axios.post('/auth/login', {
                emailOrPhone,
                password,
            });
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed',
                errorCode: 'LOGIN_ERROR',
            };
        }
    },

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
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed',
                errorCode: 'REGISTER_ERROR',
            };
        }
    },

    async logout(): Promise<ApiResponse> {
        try {
            const axios = httpService.getAxiosInstance();
            const response = await axios.post('/auth/logout');
            return response.data;
        } catch (error: any) {
            return {
                success: true,
                message: 'Logged out successfully',
            };
        }
    },
};
