import { useTranslation } from 'react-i18next';
import { Stepper } from '@/components/form/stepper';
import { FormBuilder } from '@/components/form';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { AuthCard } from '../components/AuthCard';
import { useRegister } from '../hooks/useAuthActions';
import { createRegisterFormSchema, type RegisterFormValues } from '../lib/registerFormConfig';

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

    const steps = [
        {
            title: 'Personal Information',
            content: (
                <>
                    <FormBuilder.Text
                        name="name"
                        label={t('fields.name.label')}
                        placeholder={t('fields.name.placeholder')}
                        required
                    />
                    <FormBuilder.Email
                        name="email"
                        label={t('fields.email.label')}
                        placeholder={t('fields.email.placeholder')}
                        required
                    />
                    <FormBuilder.Phone
                        name="phone"
                        label={t('fields.phone.label')}
                        placeholder={t('fields.phone.placeholder')}
                    />
                </>
            ),
        },
        {
            title: 'Security',
            content: (
                <>
                    <FormBuilder.Password
                        name="password"
                        label={t('fields.password.label')}
                        placeholder={t('fields.password.placeholder')}
                        required
                    />
                    <FormBuilder.Password
                        name="confirmPassword"
                        label={t('fields.confirmPassword.label')}
                        placeholder={t('fields.confirmPassword.placeholder')}
                        required
                    />
                </>
            ),
        },
    ];

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
            <Stepper
                steps={steps}
                onSubmit={handleSubmit}
                schema={createRegisterFormSchema(t)}
                defaultValues={{ name: '', email: '', phone: '', password: '', confirmPassword: '' }}
                loading={registerMutation.isPending}
            >
                <div className="flex justify-end gap-2">
                    <Stepper.Button direction="prev" />
                    <Stepper.Button direction="next" />
                    <Stepper.Button direction="submit" >Create Account</Stepper.Button>
                </div>
            </Stepper>
        </AuthCard>
    );
}
