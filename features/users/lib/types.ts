export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'admin' | 'manager' | 'user';
    status: 'active' | 'inactive';
    createdAt: string;
}

export interface UsersResponse {
    success: boolean;
    data: {
        content: User[];
        page: number;
        size: number;
        totalElements: number;
        totalPages: number;
    };
}

export interface UsersParams {
    page: number;
    size: number;
    search?: string;
}
