import { useState, useCallback, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { usersService } from '../services/usersService';
import type { UsersResponse } from '../lib/types';
import type { ServerPaginationState } from '@/components/dataTable';

interface UseUsersOptions {
    initialPage?: number;
    initialSize?: number;
    search?: string;
}

export function useUsers(options: UseUsersOptions = {}) {
    const { initialPage = 0, initialSize = 10, search } = options;

    const [page, setPage] = useState(initialPage);
    const [size, setSize] = useState(initialSize);

    const mutation = useMutation<UsersResponse, Error, { page: number; size: number; search?: string }>({
        mutationFn: (params) => usersService.getUsers(params),
    });

    useEffect(() => {
        mutation.mutate({ page, size, search });
    }, [page, size, search]);

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage);
    }, []);

    const handlePageSizeChange = useCallback((newSize: number) => {
        setSize(newSize);
        setPage(0); // Reset to first page when size changes
    }, []);

    const pagination: ServerPaginationState | undefined = mutation.data?.data
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
        refetch: () => mutation.mutate({ page, size, search }),
        pagination,
        onPageChange: handlePageChange,
        onPageSizeChange: handlePageSizeChange,
    };
}
