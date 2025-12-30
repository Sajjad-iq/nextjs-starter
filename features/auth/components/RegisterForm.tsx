import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { FormBuilder } from '@/components/form';
import { useAuthActions } from '@/hooks/auth';
import { setCookie } from '@/utils/cookies';
import {
  createRegisterFormConfig,
  type RegisterFormValues,
} from '../lib/registerFormConfig';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const navigate = useNavigate();
  const { register } = useAuthActions();
  const { t } = useTranslation();

  const handleSubmit = async (values: RegisterFormValues) => {
    const result = await register(
      values.name,
      values.email,
      values.phoneCode || '+964',
      values.phone || '',
      values.password
    );

    if (result.success) {
      // Save email to cookie with 1-day expiration
      setCookie('pending_activation_email', values.email, 1);

      toast.success(result.message || t('auth.register.success'));

      // Redirect to request activation page
      setTimeout(() => {
        navigate('/auth/request-activation');
      }, 1500);
    }
    // Error toast is automatically shown by HTTP interceptor
  };

  const formConfig = createRegisterFormConfig(handleSubmit, t);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">{t('auth.register.title')}</h2>
        <p className="text-sm text-muted-foreground mt-2">
          {t('auth.register.subtitle')}
        </p>
      </div>

      {/* Form */}
      <FormBuilder config={formConfig} />

      {/* Switch to login */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">{t('auth.register.haveAccount')} </span>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-primary hover:underline"
        >
          {t('auth.register.signIn')}
        </button>
      </div>
    </div>
  );
}
