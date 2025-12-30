import * as z from 'zod';
import type { FormConfig } from '@/components/form';
import type { TFunction } from 'i18next';

// Validation schema factory
export const createLoginFormSchema = (t: TFunction<'auth'>) => z.object({
  emailOrPhone: z.string().min(1, t('validation.emailOrPhoneRequired')),
  password: z
    .string()
    .min(8, t('validation.passwordMinLength'))
    .max(100, t('validation.passwordMaxLength')),
});

export type LoginFormValues = z.infer<ReturnType<typeof createLoginFormSchema>>;

// Form configuration
export const createLoginFormConfig = (
  onSubmit: (values: LoginFormValues) => Promise<void>,
  t: TFunction<'auth'>
): FormConfig => ({
  fields: [
    {
      name: 'emailOrPhone',
      type: 'text',
      label: t('fields.emailOrPhone.label'),
      placeholder: t('fields.emailOrPhone.placeholder'),
      required: true,
    },
    {
      name: 'password',
      type: 'password',
      label: t('fields.password.label'),
      placeholder: t('fields.password.placeholder'),
      required: true,
    },
  ],
  validationSchema: createLoginFormSchema(t),
  defaultValues: {
    emailOrPhone: '',
    password: '',
  },
  onSubmit,
  submitText: t('buttons.signIn'),
  loadingText: t('buttons.signingIn'),
  submitButtonClass: 'w-full',
});
