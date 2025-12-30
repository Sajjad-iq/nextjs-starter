import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { FormBuilder } from '@/components/form';
import { authService } from '@/services/authService';
import {
  createForgotPasswordFormConfig,
  type ForgotPasswordFormValues,
} from '../lib/forgotPasswordFormConfig';

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

export function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const { t } = useTranslation();

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      const result = await authService.requestPasswordReset(values.email);

      if (result.success) {
        toast.success(result.message || t('auth.forgotPassword.defaultSuccess'));
      }
      // Error toast is automatically shown by HTTP interceptor
    } catch (error: any) {
      // Error toast is automatically shown by HTTP interceptor
    }
  };

  const formConfig = createForgotPasswordFormConfig(handleSubmit, t);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">{t('auth.forgotPassword.title')}</h2>
        <p className="text-sm text-muted-foreground mt-2">
          {t('auth.forgotPassword.subtitle')}
        </p>
      </div>

      {/* Form */}
      <FormBuilder config={formConfig} />

      {/* Back to login link */}
      <div className="text-center text-sm">
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-primary hover:underline"
        >
          {t('auth.forgotPassword.backToLogin')}
        </button>
      </div>
    </div>
  );
}
