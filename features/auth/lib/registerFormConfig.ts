import * as z from 'zod';
import type { FormConfig } from '@/components/form';
import type { TFunction } from 'i18next';

// Validation schema factory
export const createRegisterFormSchema = (t: TFunction) => z
  .object({
    name: z
      .string()
      .min(3, t('auth.validation.nameMinLength'))
      .max(255, t('auth.validation.nameMaxLength')),
    email: z
      .string({ required_error: t('auth.validation.emailRequired') })
      .min(1, t('auth.validation.emailRequired'))
      .email(t('auth.validation.emailInvalid')),
    phone: z.string().optional(),
    phoneCode: z.string().optional(),
    password: z
      .string()
      .min(8, t('auth.validation.passwordMinLength'))
      .max(100, t('auth.validation.passwordMaxLength')),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t('auth.validation.passwordsDontMatch'),
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<ReturnType<typeof createRegisterFormSchema>>;

// Form configuration
export const createRegisterFormConfig = (
  onSubmit: (values: RegisterFormValues) => Promise<void>,
  t: TFunction
): FormConfig => ({
  fields: [
    {
      name: 'name',
      type: 'text',
      label: t('auth.fields.name.label'),
      placeholder: t('auth.fields.name.placeholder'),
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: t('auth.fields.email.label'),
      placeholder: t('auth.fields.email.placeholder'),
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
      label: t('auth.fields.phone.label'),
      placeholder: t('auth.fields.phone.placeholder'),
      required: false,
      defaultCountry: 'IQ',
    },
    {
      name: 'password',
      type: 'password',
      label: t('auth.fields.password.label'),
      placeholder: t('auth.fields.password.placeholder'),
      required: true,
    },
    {
      name: 'confirmPassword',
      type: 'password',
      label: t('auth.fields.confirmPassword.label'),
      placeholder: t('auth.fields.confirmPassword.placeholder'),
      required: true,
    },
  ],
  validationSchema: createRegisterFormSchema(t),
  defaultValues: {
    name: '',
    email: '',
    phone: '',
    phoneCode: '+964',
    password: '',
    confirmPassword: '',
  },
  onSubmit,
  submitText: t('auth.buttons.createAccount'),
  loadingText: t('auth.buttons.creatingAccount'),
  submitButtonClass: 'w-full',
});
