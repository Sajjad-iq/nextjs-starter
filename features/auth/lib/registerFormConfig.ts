import * as z from 'zod';
import type { TFunction } from 'i18next';

export const createRegisterFormSchema = (t: TFunction<'auth'>) => z.object({
    name: z.string().min(3, t('validation.nameMinLength')).max(255, t('validation.nameMaxLength')),
    email: z.string().min(1, t('validation.emailRequired')).email(t('validation.emailInvalid')),
    phone: z.string().optional(),
    password: z.string().min(8, t('validation.passwordMinLength')).max(100, t('validation.passwordMaxLength')),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: t('validation.passwordsDontMatch'),
    path: ['confirmPassword'],
});

export type RegisterFormValues = z.infer<ReturnType<typeof createRegisterFormSchema>>;
