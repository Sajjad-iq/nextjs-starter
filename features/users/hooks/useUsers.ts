import { useState, useCallback, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { usersService } from '../services/usersService';
import type { UsersResponse } from '../lib/types';
import type { ServerPaginationState, PaginationChangeEvent } from '@/components/dataTable';

interface UseUsersOptions {
    initialPage?: number;
    initialSize?: number;
    search?: string;
}

export function useUsers(options: UseUsersOptions = {}) {
    const { initialPage = 0, initialSize = 10, search } = options;

    const [pagination, setPagination] = useState({
        page: initialPage,
        size: initialSize,
    });

    const mutation = useMutation<UsersResponse, Error, { page: number; size: number; search?: string }>({
        mutationFn: (params) => usersService.getUsers(params),
    });

    // Fetch on mount and when pagination changes
    useEffect(() => {
        mutation.mutate({ ...pagination, search });
    }, [pagination.page, pagination.size, search]);

    const handlePaginate = useCallback((event: PaginationChangeEvent) => {
        setPagination(prev => ({
            // Reset page to 0 when size changes
            page: event.size !== undefined ? 0 : (event.page ?? prev.page),
            size: event.size !== undefined ? event.size : prev.size,
        }));
    }, []);

    const serverPagination: ServerPaginationState | undefined = mutation.data?.data
        ? {
            page: mutation.data.data.page,
            size: mutation.data.data.size,
            totalElements: mutation.data.data.totalElements,
            totalPages: mutation.data.data.totalPages,
        }
        : undefined;

    return {
        users: mutation.data?.data?.content ?? [],
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
        refetch: () => mutation.mutate({ ...pagination, search }),
        serverPagination,
        onPaginate: handlePaginate,
    };
}
