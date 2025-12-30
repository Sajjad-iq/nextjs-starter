import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/authService';
import { getCookie } from '@/utils/cookies';

export default function RequestActivationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  // Local state
  const [isResending, setIsResending] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Rate limiting state
  const [resendCount, setResendCount] = useState(0);
  const maxResendAttempts = 3;
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const cooldownDuration = 60; // 60 seconds
  const cooldownInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Computed: Check if send button should be disabled
  const isSendDisabled =
    !userEmail ||
    isResending ||
    cooldownSeconds > 0 ||
    resendCount >= maxResendAttempts;

  // Start cooldown timer
  const startCooldown = useCallback(() => {
    setCooldownSeconds(cooldownDuration);

    // Clear existing interval if any
    if (cooldownInterval.current) {
      clearInterval(cooldownInterval.current);
    }

    // Start countdown
    cooldownInterval.current = setInterval(() => {
      setCooldownSeconds((prev) => {
        const newValue = prev - 1;
        if (newValue <= 0) {
          if (cooldownInterval.current) {
            clearInterval(cooldownInterval.current);
            cooldownInterval.current = null;
          }
          return 0;
        }
        return newValue;
      });
    }, 1000);
  }, [cooldownDuration]);

  // Send new activation link via email
  const sendActivationLink = async () => {
    // Check if already at max attempts
    if (resendCount >= maxResendAttempts) {
      toast.error(t('auth.activate.maxAttemptsError', { max: maxResendAttempts }));
      return;
    }

    // Check if in cooldown period
    if (cooldownSeconds > 0) {
      toast.error(t('auth.activate.waitError', { seconds: cooldownSeconds }));
      return;
    }

    if (!userEmail) {
      toast.error(t('auth.activate.emailNotFound'));
      return;
    }

    setIsResending(true);

    try {
      const result = await authService.resendActivation(userEmail);

      if (result.success) {
        // Increment counter
        setResendCount((prev) => prev + 1);

        toast.success(result.message || t('auth.activate.sendSuccess', { count: resendCount + 1, max: maxResendAttempts }));

        // Start cooldown only if not at max attempts
        if (resendCount + 1 < maxResendAttempts) {
          startCooldown();
        } else {
          toast.info(t('auth.activate.maxAttemptsMessage'));
        }
      }
      // Error toast is automatically shown by HTTP interceptor
    } catch (err) {
      console.error('Send activation link error:', err);
      // Error toast is automatically shown by HTTP interceptor
    } finally {
      setIsResending(false);
    }
  };

  // Initialize - get email from cookie or query params
  useEffect(() => {
    // Get email from cookie (set during failed login)
    const email = getCookie('pending_activation_email');

    if (email) {
      setUserEmail(email);
    } else {
      // No email in cookie - check query params as fallback
      const queryEmail = searchParams.get('email');
      if (queryEmail) {
        setUserEmail(queryEmail);
      } else {
        toast.error(t('auth.activate.emailNotFound'));
      }
    }
  }, [searchParams, t]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (cooldownInterval.current) {
        clearInterval(cooldownInterval.current);
        cooldownInterval.current = null;
      }
    };
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
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight">{t('auth.activate.notActivated')}</h2>
              <p className="text-sm text-muted-foreground mt-2">
                {t('auth.activate.notActivatedSubtitle')}
              </p>
              {userEmail && (
                <p className="text-sm font-medium mt-2">
                  {t('auth.activate.sendToEmail')}{' '}
                  <span className="text-primary">{userEmail}</span>
                </p>
              )}
            </div>

            {/* Message */}
            <div className="bg-muted/50 border rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">
                {t('auth.activate.instructionMessage')}
              </p>
            </div>

            {/* Send Activation Link Button */}
            <div className="space-y-3">
              <Button
                onClick={sendActivationLink}
                className="w-full"
                disabled={isSendDisabled}
              >
                {isResending ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {t('auth.activate.sending')}
                  </span>
                ) : cooldownSeconds > 0 ? (
                  t('auth.activate.waitToResend', { seconds: cooldownSeconds })
                ) : resendCount >= maxResendAttempts ? (
                  t('auth.activate.maxAttemptsReached')
                ) : (
                  t('auth.activate.sendButton', { count: resendCount, max: maxResendAttempts })
                )}
              </Button>

              {/* Resend Counter Info */}
              {resendCount > 0 && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    {cooldownSeconds > 0 ? (
                      t('auth.activate.cooldownMessage', { seconds: cooldownSeconds })
                    ) : resendCount >= maxResendAttempts ? (
                      <span className="text-destructive">
                        {t('auth.activate.maxAttemptsWarning', { max: maxResendAttempts })}
                      </span>
                    ) : (
                      t('auth.activate.attemptsRemaining', { count: maxResendAttempts - resendCount })
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                {t('auth.activate.checkEmail')}
              </p>
            </div>

            {/* Warning for max attempts */}
            {resendCount >= maxResendAttempts && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-sm text-destructive">
                  {t('auth.activate.maxAttemptsInfo')}
                </p>
              </div>
            )}

            {/* Back to login */}
            <div className="text-center text-sm">
              <button
                onClick={() => navigate('/auth')}
                className="text-primary hover:underline"
              >
                {t('auth.activate.backToLogin')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
