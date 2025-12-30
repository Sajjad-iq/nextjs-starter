import * as z from 'zod';
import type { TFunction } from 'i18next';

export const createLoginFormSchema = (t: TFunction<'auth'>) => z.object({
    emailOrPhone: z.string().min(1, t('validation.emailOrPhoneRequired')),
    password: z.string().min(8, t('validation.passwordMinLength')).max(100, t('validation.passwordMaxLength')),
});

export type LoginFormValues = z.infer<ReturnType<typeof createLoginFormSchema>>;
