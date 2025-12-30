import type { ApiResponse } from '@/types/global';

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'admin' | 'manager' | 'user';
    status: 'active' | 'inactive';
    createdAt: string;
}

export interface UsersData {
    content: User[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export type UsersResponse = ApiResponse<UsersData>;
export type UserResponse = ApiResponse<User>;

export interface UserFormValues {
    name: string;
    email: string;
    phone?: string;
    role: 'admin' | 'manager' | 'user';
    status: 'active' | 'inactive';
}
