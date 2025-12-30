import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { ForgotPasswordForm } from './components/ForgotPasswordForm';

type AuthView = 'login' | 'register' | 'forgot-password';

export default function AuthPage() {
  const [authView, setAuthView] = useState<AuthView>('login');
  const { t } = useTranslation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">{t('auth.appName')}</h1>
          <p className="text-muted-foreground">{t('auth.tagline')}</p>
        </div>

        {/* Card Container */}
        <div className="bg-card border rounded-lg shadow-sm p-8">
          {/* Login Form */}
          {authView === 'login' && (
            <LoginForm
              onSwitchToRegister={() => setAuthView('register')}
              onForgotPassword={() => setAuthView('forgot-password')}
            />
          )}

          {/* Register Form */}
          {authView === 'register' && (
            <RegisterForm onSwitchToLogin={() => setAuthView('login')} />
          )}

          {/* Forgot Password Form */}
          {authView === 'forgot-password' && (
            <ForgotPasswordForm onBackToLogin={() => setAuthView('login')} />
          )}
        </div>
      </div>
    </div>
  );
}
