'use client';

import { ReactNode, useRef } from 'react';
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
import { createUserFormConfig } from '../lib/userFormConfig';
import type { User, UserFormValues } from '../lib/types';

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

    const formConfig = createUserFormConfig(handleSubmit, userData ?? undefined);

    return (
        <Dialog onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit User' : 'Create User'}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? 'Update user information' : 'Add a new user to the system'}
                    </DialogDescription>
                </DialogHeader>
                {isEdit && getUserMutation.isPending ? (
                    <div className="py-8">
                        <Spinner centered />
                    </div>
                ) : (
                    <FormBuilder
                        key={userData?.id ?? 'new'}
                        config={formConfig}
                        loading={isLoading}
                    />
                )}
                <DialogClose ref={closeRef} className="hidden" />
            </DialogContent>
        </Dialog>
    );
}
