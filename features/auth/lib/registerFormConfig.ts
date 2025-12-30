import * as z from 'zod';
import type { FormConfig } from '@/components/form';
import type { TFunction } from 'i18next';

// Validation schema factory
export const createRegisterFormSchema = (t: TFunction<'auth'>) => z
  .object({
    name: z
      .string()
      .min(3, t('validation.nameMinLength'))
      .max(255, t('validation.nameMaxLength')),
    email: z
      .string()
      .min(1, t('validation.emailRequired'))
      .email(t('validation.emailInvalid')),
    phone: z.string().optional(),
    phoneCode: z.string().optional(),
    password: z
      .string()
      .min(8, t('validation.passwordMinLength'))
      .max(100, t('validation.passwordMaxLength')),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t('validation.passwordsDontMatch'),
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<ReturnType<typeof createRegisterFormSchema>>;

// Form configuration
export const createRegisterFormConfig = (
  onSubmit: (values: RegisterFormValues) => Promise<void>,
  t: TFunction<'auth'>
): FormConfig => ({
  fields: [
    {
      name: 'name',
      type: 'text',
      label: t('fields.name.label'),
      placeholder: t('fields.name.placeholder'),
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: t('fields.email.label'),
      placeholder: t('fields.email.placeholder'),
      required: true,
    },
    {
      name: 'phoneCode',
      type: 'hidden',
      label: '',
      required: false,
    },
    {
      name: 'phone',
      type: 'phone',
      label: t('fields.phone.label'),
      placeholder: t('fields.phone.placeholder'),
      required: false,
      defaultCountry: 'IQ',
    },
    {
      name: 'password',
      type: 'password',
      label: t('fields.password.label'),
      placeholder: t('fields.password.placeholder'),
      required: true,
    },
    {
      name: 'confirmPassword',
      type: 'password',
      label: t('fields.confirmPassword.label'),
      placeholder: t('fields.confirmPassword.placeholder'),
      required: true,
    },
  ],
  validationSchema: createRegisterFormSchema(t),
  initialValues: {
    name: '',
    email: '',
    phone: '',
    phoneCode: '+964',
    password: '',
    confirmPassword: '',
  },
  onSubmit: onSubmit as (values: Record<string, any>) => Promise<void>,
  submitText: t('buttons.createAccount'),
  loadingText: t('buttons.creatingAccount'),
  submitButtonClass: 'w-full',
});
