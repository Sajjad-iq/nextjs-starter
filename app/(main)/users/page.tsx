'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable, ServerPaginationState } from '@/components/dataTable';
import { Badge } from '@/components/ui/badge';
import { httpService } from '@/lib/config/http';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    createdAt: string;
}

interface UsersResponse {
    success: boolean;
    data: {
        content: User[];
        page: number;
        size: number;
        totalElements: number;
        totalPages: number;
    };
}

const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
    },
    {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => {
            const role = row.getValue('role') as string;
            return (
                <Badge variant={role === 'admin' ? 'default' : role === 'manager' ? 'secondary' : 'outline'}>
                    {role}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            return (
                <Badge variant={status === 'active' ? 'default' : 'destructive'}>
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'createdAt',
        header: 'Created At',
        cell: ({ row }) => {
            const date = new Date(row.getValue('createdAt'));
            return date.toLocaleDateString();
        },
    },
];

export default function UsersPage() {
    const [pagination, setPagination] = useState({ page: 0, size: 10 });

    const { data, isLoading, refetch } = useQuery<UsersResponse>({
        queryKey: ['users', pagination.page, pagination.size],
        queryFn: async () => {
            const axios = httpService.getAxiosInstance();
            const response = await axios.get('/users', {
                params: {
                    page: pagination.page,
                    size: pagination.size,
                },
            });
            return response.data;
        },
    });

    const handlePaginate = useCallback((event: { page?: number; size?: number }) => {
        setPagination(prev => ({
            page: event.page ?? prev.page,
            size: event.size ?? prev.size,
        }));
    }, []);

    const serverPagination: ServerPaginationState | undefined = data?.data
        ? {
            page: data.data.page,
            size: data.data.size,
            totalElements: data.data.totalElements,
            totalPages: data.data.totalPages,
        }
        : undefined;

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Users</h1>
                <p className="text-muted-foreground">Manage system users</p>
            </div>

            <div className="flex-1 min-h-0">
                <DataTable
                    data={data?.data?.content ?? []}
                    columns={columns}
                    serverPagination={serverPagination}
                    onPaginate={handlePaginate}
                    isLoading={isLoading}
                    onRetry={() => refetch()}
                />
            </div>
        </div>
    );
}
