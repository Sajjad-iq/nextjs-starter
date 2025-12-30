import * as z from 'zod';
import type { FormConfig } from '@/components/form';
import type { User, UserFormValues } from './types';

export const userFormSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    role: z.enum(['admin', 'manager', 'user']),
    status: z.enum(['active', 'inactive']),
});

export const createUserFormConfig = (
    onSubmit: (values: UserFormValues) => Promise<void>,
    initialValues?: Partial<User>
): FormConfig => ({
    fields: [
        {
            name: 'name',
            type: 'text',
            label: 'Name',
            placeholder: 'Enter user name',
            required: true,
        },
        {
            name: 'email',
            type: 'email',
            label: 'Email',
            placeholder: 'Enter email address',
            required: true,
        },
        {
            name: 'phone',
            type: 'phone',
            label: 'Phone',
            placeholder: 'Enter phone number',
            required: false,
            defaultCountry: 'IQ',
        },
        {
            name: 'role',
            type: 'select',
            label: 'Role',
            required: true,
            options: [
                { label: 'Admin', value: 'admin' },
                { label: 'Manager', value: 'manager' },
                { label: 'User', value: 'user' },
            ],
        },
        {
            name: 'status',
            type: 'select',
            label: 'Status',
            required: true,
            options: [
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
            ],
        },
    ],
    validationSchema: userFormSchema,
    initialValues: {
        name: initialValues?.name ?? '',
        email: initialValues?.email ?? '',
        phone: initialValues?.phone ?? '',
        role: initialValues?.role ?? 'user',
        status: initialValues?.status ?? 'active',
    },
    onSubmit: onSubmit as (values: Record<string, any>) => Promise<void>,
    submitText: initialValues?.id ? 'Update User' : 'Create User',
    loadingText: initialValues?.id ? 'Updating...' : 'Creating...',
});
