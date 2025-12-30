import * as z from 'zod';
import type { FormConfig } from '@/components/form';
import type { TFunction } from 'i18next';

// Validation schema factory
export const createLoginFormSchema = (t: TFunction) => z.object({
  emailOrPhone: z.string().min(1, t('auth.validation.emailOrPhoneRequired')),
  password: z
    .string()
    .min(8, t('auth.validation.passwordMinLength'))
    .max(100, t('auth.validation.passwordMaxLength')),
});

export type LoginFormValues = z.infer<ReturnType<typeof createLoginFormSchema>>;

// Form configuration
export const createLoginFormConfig = (
  onSubmit: (values: LoginFormValues) => Promise<void>,
  t: TFunction
): FormConfig => ({
  fields: [
    {
      name: 'emailOrPhone',
      type: 'text',
      label: t('auth.fields.emailOrPhone.label'),
      placeholder: t('auth.fields.emailOrPhone.placeholder'),
      required: true,
    },
    {
      name: 'password',
      type: 'password',
      label: t('auth.fields.password.label'),
      placeholder: t('auth.fields.password.placeholder'),
      required: true,
    },
  ],
  validationSchema: createLoginFormSchema(t),
  defaultValues: {
    emailOrPhone: '',
    password: '',
  },
  onSubmit,
  submitText: t('auth.buttons.signIn'),
  loadingText: t('auth.buttons.signingIn'),
  submitButtonClass: 'w-full',
});
