import { httpService } from '@/lib/config/http';
import type { UsersResponse, UserResponse, UsersParams, UserFormValues } from '../lib/types';

export const usersService = {
    async getUsers(params: UsersParams): Promise<UsersResponse> {
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
