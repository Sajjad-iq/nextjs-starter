import { useTranslation } from 'react-i18next';
import { FormBuilder } from '@/components/form';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { AuthCard } from '../components/AuthCard';
import { useLogin } from '../hooks/useAuthActions';
import { createLoginFormSchema, type LoginFormValues } from '../lib/loginFormConfig';

export default function LoginPage() {
    const router = useRouter();
    const { t } = useTranslation('auth');
    const loginMutation = useLogin();

    const handleSubmit = async (values: LoginFormValues) => {
        loginMutation.mutate({
            emailOrPhone: values.emailOrPhone,
            password: values.password,
        });
    };

    return (
        <AuthCard
            title={t('login.title')}
            subtitle={t('login.subtitle')}
            footer={
                <>
                    <span className="text-muted-foreground">{t('login.noAccount')} </span>
                    <Button type="button" variant="link" size="sm" onClick={() => router.push('/register')} className="px-0 h-auto">
                        {t('login.signUp')}
                    </Button>
                </>
            }
        >
            <FormBuilder
                onSubmit={handleSubmit}
                schema={createLoginFormSchema(t)}
                defaultValues={{ emailOrPhone: '', password: '' }}
                loading={loginMutation.isPending}
            >
                <FormBuilder.Text name="emailOrPhone" label={t('fields.emailOrPhone.label')} placeholder={t('fields.emailOrPhone.placeholder')} required />
                <FormBuilder.Password name="password" label={t('fields.password.label')} placeholder={t('fields.password.placeholder')} required />
                <FormBuilder.Submit className="w-full" loadingText={t('buttons.signingIn')}>{t('buttons.signIn')}</FormBuilder.Submit>
            </FormBuilder>
        </AuthCard>
    );
}
