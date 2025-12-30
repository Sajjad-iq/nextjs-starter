'use client';

import { ReactNode, useRef } from 'react';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';
import { FormBuilder } from '@/components/form';
import { Spinner } from '@/components/common';
import { useCreateUser, useUpdateUser, useGetUser } from '../hooks/useUserActions';
import type { User, UserFormValues } from '../lib/types';

const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    role: z.enum(['admin', 'manager', 'user']),
    status: z.enum(['active', 'inactive']),
});

interface UserDialogProps {
    children: ReactNode;
    user?: User | null;
    onSuccess?: () => void;
}

export function UserDialog({ children, user, onSuccess }: UserDialogProps) {
    const closeRef = useRef<HTMLButtonElement>(null);
    const isEdit = !!user?.id;

    const handleSuccess = () => {
        closeRef.current?.click();
        onSuccess?.();
    };

    const getUserMutation = useGetUser();
    const createMutation = useCreateUser({ onSuccess: handleSuccess });
    const updateMutation = useUpdateUser(user?.id ?? '', { onSuccess: handleSuccess });

    const handleOpenChange = (open: boolean) => {
        if (open && user?.id) {
            getUserMutation.mutate(user.id);
        }
    };

    const handleSubmit = async (values: UserFormValues) => {
        if (isEdit) {
            await updateMutation.mutateAsync(values);
        } else {
            await createMutation.mutateAsync(values);
        }
    };

    const userData = getUserMutation.data?.data ?? user;
    const isLoading = getUserMutation.isPending || createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit User' : 'Create User'}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? 'Update user information' : 'Add a new user to the system'}
                    </DialogDescription>
                </DialogHeader>
                {isEdit && getUserMutation.isPending ? (
                    <div className="py-8"><Spinner centered /></div>
                ) : (
                    <FormBuilder
                        key={userData?.id ?? 'new'}
                        onSubmit={handleSubmit}
                        schema={schema}
                        defaultValues={{
                            name: userData?.name ?? '',
                            email: userData?.email ?? '',
                            phone: userData?.phone ?? '',
                            role: userData?.role ?? 'user',
                            status: userData?.status ?? 'active',
                        }}
                        loading={isLoading}
                    >
                        <FormBuilder.Text name="name" label="Name" placeholder="Enter user name" required />
                        <FormBuilder.Email name="email" label="Email" placeholder="Enter email address" required />
                        <FormBuilder.Phone name="phone" label="Phone" placeholder="Enter phone number" />
                        <FormBuilder.Select name="role" label="Role" required options={[
                            { label: 'Admin', value: 'admin' },
                            { label: 'Manager', value: 'manager' },
                            { label: 'User', value: 'user' },
                        ]} />
                        <FormBuilder.Select name="status" label="Status" required options={[
                            { label: 'Active', value: 'active' },
                            { label: 'Inactive', value: 'inactive' },
                        ]} />
                        <div className="flex justify-end pt-4">
                            <FormBuilder.Submit loadingText={isEdit ? 'Updating...' : 'Creating...'}>
                                {isEdit ? 'Update User' : 'Create User'}
                            </FormBuilder.Submit>
                        </div>
                    </FormBuilder>
                )}
                <DialogClose ref={closeRef} className="hidden" />
            </DialogContent>
        </Dialog>
    );
}
