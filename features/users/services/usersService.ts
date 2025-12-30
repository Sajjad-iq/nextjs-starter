import { httpService } from '@/lib/config/http';
import type { UsersResponse, UserResponse, UserFormValues } from '../lib/types';

interface GetUsersParams {
    page?: number;
    size?: number;
    search?: string;
}

export const usersService = {
    async getUsers(params?: GetUsersParams): Promise<UsersResponse> {
        const axios = httpService.getAxiosInstance();
        const response = await axios.get('/users', { params });
        return response.data;
    },

    async getUser(id: string): Promise<UserResponse> {
        const axios = httpService.getAxiosInstance();
        const response = await axios.get(`/users/${id}`);
        return response.data;
    },

    async createUser(data: UserFormValues): Promise<UserResponse> {
        const axios = httpService.getAxiosInstance();
        const response = await axios.post('/users', data);
        return response.data;
    },

    async updateUser(id: string, data: UserFormValues): Promise<UserResponse> {
        const axios = httpService.getAxiosInstance();
        const response = await axios.put(`/users/${id}`, data);
        return response.data;
    },
};
