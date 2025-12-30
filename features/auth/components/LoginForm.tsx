import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { FormBuilder } from '@/components/form';
import { useAuthActions } from '@/hooks/auth';
import {
  createLoginFormConfig,
  type LoginFormValues,
} from '../lib/loginFormConfig';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
}

export function LoginForm({
  onSwitchToRegister,
  onForgotPassword,
}: LoginFormProps) {
  const navigate = useNavigate();
  const { login } = useAuthActions();
  const { t } = useTranslation();

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      console.log('[LoginForm] Submitting login...');
      const result = await login(values.emailOrPhone, values.password);
      console.log('[LoginForm] Login complete, result:', result);

      if (result.success) {
        toast.success(result.message || t('auth.login.success'));
        console.log('[LoginForm] Navigating to /');
        navigate('/');
      } else {
        // Check if error code is ACCOUNT_NOT_ACTIVATED
        if (result.errorCode === 'ACCOUNT_NOT_ACTIVATED') {
          // Redirect to request activation page
          setTimeout(() => {
            navigate('/auth/request-activation?email=' + (result.email || values.emailOrPhone));
          }, 1500);
        }
        // Other error toasts are automatically shown by HTTP interceptor
      }
    } catch (error) {
      console.error('[LoginForm] Login error:', error);
      // Error toast is automatically shown by HTTP interceptor
    }
  };

  const formConfig = createLoginFormConfig(handleSubmit, t);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">{t('auth.login.title')}</h2>
        <p className="text-sm text-muted-foreground mt-2">
          {t('auth.login.subtitle')}
        </p>
      </div>

      {/* Form */}
      <FormBuilder config={formConfig} />

      {/* Forgot password link */}
      <div className="flex justify-end -mt-2">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-primary hover:underline"
        >
          {t('auth.login.forgotPassword')}
        </button>
      </div>

      {/* Switch to register */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">{t('auth.login.noAccount')} </span>
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-primary hover:underline"
        >
          {t('auth.login.signUp')}
        </button>
      </div>
    </div>
  );
}
