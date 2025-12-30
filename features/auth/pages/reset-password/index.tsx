import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/auth';
import { X, AlertTriangle } from 'lucide-react';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const authStore = useAuthStore();
  const { t } = useTranslation();

  // Local state
  const [isValidatingToken, setIsValidatingToken] = useState(false);
  const [tokenValidated, setTokenValidated] = useState(false);
  const [tokenInvalid, setTokenInvalid] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  // Validate password match using useEffect to properly react to state changes
  useEffect(() => {
    if (confirmPassword.length > 0) {
      setPasswordMismatch(newPassword !== confirmPassword);
    } else {
      setPasswordMismatch(false);
    }
  }, [newPassword, confirmPassword]);

  // Check if form can be submitted
  const canSubmit = useMemo(() => {
    return (
      newPassword.length >= 8 &&
      confirmPassword.length >= 8 &&
      newPassword === confirmPassword &&
      !passwordMismatch
    );
  }, [newPassword, confirmPassword, passwordMismatch]);

  // Validate token (just check if it exists - backend will validate fully)
  const validateToken = async (token: string) => {
    setIsValidatingToken(true);

    try {
      // Just check if token exists and is not empty
      if (token && token.trim().length > 0) {
        // Token looks valid - show password form
        setResetToken(token);
        setTokenValidated(true);
        setIsValidatingToken(false);
      } else {
        // Invalid token format
        setTokenInvalid(true);
        setIsValidatingToken(false);
      }
    } catch (error) {
      console.error('Token validation error:', error);
      setTokenInvalid(true);
      setIsValidatingToken(false);
    }
  };

  // Password Submit handler
  const onPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resetToken) {
      toast.error(t('auth.resetPassword.tokenMissing'));
      return;
    }

    if (!newPassword || !confirmPassword) {
      toast.error(t('auth.resetPassword.fillBothFields'));
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(t('auth.resetPassword.passwordMismatch'));
      return;
    }

    if (newPassword.length < 8) {
      toast.error(t('auth.resetPassword.passwordTooShort'));
      return;
    }

    setIsResetting(true);

    try {
      const result = await authService.resetPassword(resetToken, newPassword);

      if (result.success && result.data) {
        // Backend returns LoginResponse with JWT token - user is now logged in
        toast.success(result.message || t('auth.resetPassword.success'));

        // Store user data in auth store
        authStore.setUser(result.data.user);

        // Redirect to dashboard after short delay
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        // Check if token is invalid or expired
        if (result.errorCode === 'INVALID_TOKEN' || result.errorCode === 'EXPIRED_TOKEN') {
          setTokenInvalid(true);
          setTokenValidated(false);
        }
        // Error toast is automatically shown by HTTP interceptor
      }
    } catch (error) {
      console.error('Reset password error:', error);
      // Error toast is automatically shown by HTTP interceptor
    } finally {
      setIsResetting(false);
    }
  };

  // Lifecycle - check for token in URL
  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // Token found in URL - validate it
      validateToken(token);
    } else {
      // No token in URL - don't set any state (show no token state)
      // Both tokenInvalid and tokenValidated stay false
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Retail System</h1>
        </div>

        {/* Card */}
        <div className="bg-card border rounded-lg shadow-sm p-8 space-y-6">
          {/* Validating Token State */}
          {isValidatingToken && (
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
              <div>
                <h2 className="text-2xl font-bold">Validating Reset Link</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Please wait while we validate your password reset link...
                </p>
              </div>
            </div>
          )}

          {/* Password Reset Form (shown when token is valid) */}
          {tokenValidated && !isValidatingToken && (
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight">Reset Your Password</h2>
                <p className="text-sm text-muted-foreground mt-2">Enter your new password below</p>
              </div>

              {/* Password Form */}
              <form onSubmit={onPasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">New Password</label>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isResetting}
                  />
                  <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm Password</label>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isResetting}
                  />
                  {passwordMismatch && confirmPassword.length > 0 && (
                    <p className="text-xs text-destructive">Passwords do not match</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isResetting || !canSubmit}>
                  {isResetting ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Resetting password...
                    </span>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </form>

              {/* Password Requirements */}
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>Password Requirements:</strong>
                </p>
                <ul className="text-xs text-blue-900 dark:text-blue-100 mt-2 space-y-1 list-disc list-inside">
                  <li>At least 8 characters long</li>
                  <li>Both passwords must match</li>
                </ul>
              </div>
            </div>
          )}

          {/* Invalid/Expired Token State */}
          {tokenInvalid && (
            <div className="text-center space-y-4">
              <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3 w-16 h-16 mx-auto flex items-center justify-center">
                <X className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Invalid or Expired Link</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  This password reset link is invalid or has expired.
                </p>
              </div>
              <div className="pt-4">
                <Button className="w-full" onClick={() => navigate('/auth')}>
                  Request New Reset Link
                </Button>
              </div>
            </div>
          )}

          {/* No Token in URL */}
          {!isValidatingToken && !tokenValidated && !tokenInvalid && (
            <div className="text-center space-y-4">
              <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/20 p-3 w-16 h-16 mx-auto flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">No Reset Token Found</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Please use the password reset link from your email.
                </p>
              </div>
              <div className="pt-4">
                <Button className="w-full" onClick={() => navigate('/auth')}>
                  Request Reset Link
                </Button>
              </div>
            </div>
          )}

          {/* Back to login */}
          <div className="text-center text-sm border-t pt-4">
            <button onClick={() => navigate('/auth')} className="text-primary hover:underline">
              Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
