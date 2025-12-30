import { useTranslation } from 'react-i18next';
import { FormBuilder } from '@/components/form';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { AuthCard } from '../components/AuthCard';
import { useRegister } from '../hooks/useAuthActions';
import {
    createRegisterFormConfig,
    type RegisterFormValues,
} from '../lib/registerFormConfig';

export default function RegisterPage() {
    const router = useRouter();
    const { t } = useTranslation('auth');
    const registerMutation = useRegister();

    const handleSubmit = async (values: RegisterFormValues) => {
        registerMutation.mutate({
            name: values.name,
            email: values.email,
            phone: values.phone || '',
            password: values.password,
        });
    };

    const formConfig = createRegisterFormConfig(handleSubmit, t);

    return (
        <AuthCard
            title={t('register.title')}
            subtitle={t('register.subtitle')}
            footer={
                <>
                    <span className="text-muted-foreground">{t('register.haveAccount')} </span>
                    <Button
                        type="button"
                        variant="link"
                        size="sm"
                        onClick={() => router.push('/login')}
                        className="px-0 h-auto"
                    >
                        {t('register.signIn')}
                    </Button>
                </>
            }
        >
            <FormBuilder config={formConfig} />
        </AuthCard>
    );
}
