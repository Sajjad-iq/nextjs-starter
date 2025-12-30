import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/auth';
import { deleteCookie } from '@/utils/cookies';
import { Check } from 'lucide-react';

export default function ActivatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const authStore = useAuthStore();
  const { t } = useTranslation();

  // Local state
  const [isActivating, setIsActivating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  // Track if activation has already been attempted
  const activationAttempted = useRef(false);

  // Initialize - check for token in URL
  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      // No token - redirect to request activation page
      toast.error(t('auth.activate.emailNotFound'));
      navigate('/auth/request-activation');
      return;
    }

    if (activationAttempted.current) {
      // Already attempted activation
      return;
    }

    // Mark as attempted before starting
    activationAttempted.current = true;
    setIsActivating(true);

    // Activate account with token
    const activateAccount = async () => {
      try {
        console.log('[Activate] Attempting activation with token:', token);
        const result = await authService.activateAccount(token);
        console.log('[Activate] Activation result:', result);

        // Backend returns user at top level OR under data (handle both formats)
        const user = (result as any).user || result.data?.user;

        if (result.success && user) {
          setSuccess(true);

          // Set user in auth store
          authStore.setUser(user);

          // Delete the pending activation email cookie
          deleteCookie('pending_activation_email');

          toast.success(result.message || t('auth.activate.activateSuccess'));

          // Redirect to dashboard after delay to ensure cookie is set
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else {
          console.error('[Activate] Activation failed:', result);
          setError(true);
          // Error toast is automatically shown by HTTP interceptor
        }
      } catch (err: any) {
        console.error('[Activate] Activation error:', err);
        console.error('[Activate] Error response:', err.response?.data);
        setError(true);
        // Error toast is automatically shown by HTTP interceptor
      } finally {
        setIsActivating(false);
      }
    };

    activateAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">{t('auth.activate.appName')}</h1>
        </div>

        {/* Card */}
        <div className="bg-card border rounded-lg shadow-sm p-8">
          {/* Activating State */}
          {isActivating && (
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
              <div>
                <h2 className="text-2xl font-bold">{t('auth.activate.activating')}</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  {t('auth.activate.activatingSubtitle')}
                </p>
              </div>
            </div>
          )}

          {/* Success State */}
          {success && (
            <div className="text-center space-y-4">
              <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3 w-16 h-16 mx-auto flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{t('auth.activate.activated')}</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  {t('auth.activate.activatedSubtitle')}
                </p>
              </div>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center space-y-4">
              <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3 w-16 h-16 mx-auto flex items-center justify-center">
                <Check className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-destructive">{t('auth.activate.activateFailed')}</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  {t('auth.activate.notActivatedSubtitle')}
                </p>
              </div>
              <div className="text-center text-sm">
                <button
                  onClick={() => navigate('/auth/request-activation')}
                  className="text-primary hover:underline"
                >
                  {t('auth.activate.notActivated')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
