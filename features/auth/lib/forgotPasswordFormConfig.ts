import * as z from 'zod';
import type { FormConfig } from '@/components/form';
import type { TFunction } from 'i18next';

// Validation schema factory
export const createForgotPasswordFormSchema = (t: TFunction) => z.object({
  email: z.string().email(t('auth.validation.emailInvalid')),
});

export type ForgotPasswordFormValues = z.infer<ReturnType<typeof createForgotPasswordFormSchema>>;

// Form configuration
export const createForgotPasswordFormConfig = (
  onSubmit: (values: ForgotPasswordFormValues) => Promise<void>,
  t: TFunction
): FormConfig => ({
  fields: [
    {
      name: 'email',
      type: 'email',
      label: t('auth.fields.email.label'),
      placeholder: t('auth.fields.email.placeholderExample'),
      required: true,
    },
  ],
  validationSchema: createForgotPasswordFormSchema(t),
  defaultValues: {
    email: '',
  },
  onSubmit,
  submitText: t('auth.buttons.sendResetLink'),
  loadingText: t('auth.buttons.sending'),
  submitButtonClass: 'w-full',
});
