import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usersService } from '../services/usersService';
import type { UserFormValues, UserResponse } from '../lib/types';

interface UseCreateUserOptions {
    onSuccess?: () => void;
}

export function useCreateUser(options: UseCreateUserOptions = {}) {
    return useMutation<UserResponse, Error, UserFormValues>({
        mutationFn: (data) => usersService.createUser(data),
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message || 'User created successfully');
                options.onSuccess?.();
            }
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create user');
        },
    });
}

interface UseUpdateUserOptions {
    onSuccess?: () => void;
}

export function useUpdateUser(userId: string, options: UseUpdateUserOptions = {}) {
    return useMutation<UserResponse, Error, UserFormValues>({
        mutationFn: (data) => usersService.updateUser(userId, data),
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message || 'User updated successfully');
                options.onSuccess?.();
            }
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update user');
        },
    });
}

export function useGetUser() {
    return useMutation<UserResponse, Error, string>({
        mutationFn: (id) => usersService.getUser(id),
    });
}
