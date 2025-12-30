import { httpService } from '@/lib/config/http';
import type { UsersResponse, UsersParams } from '../lib/types';

export const usersService = {
    async getUsers(params: UsersParams): Promise<UsersResponse> {
        const axios = httpService.getAxiosInstance();
        const response = await axios.get('/users', { params });
        return response.data;
    },
};
