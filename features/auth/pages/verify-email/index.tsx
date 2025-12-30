import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { userService } from '@/routes/profile/services/userService';
import { useAuthStore } from '@/stores/auth';

/**
 * Email Verification Page
 *
 * Verifies email change for existing logged-in users
 * Different from activation - this is for email updates, not new accounts
 */
export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const authStore = useAuthStore();

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [verificationError, setVerificationError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const goToProfile = () => {
    navigate('/profile');
  };

  useEffect(() => {
    const verifyEmail = async () => {
      // Get verification code from URL query parameter
      const code = searchParams.get('code');

      if (!code) {
        // No code provided - show invalid link state
        return;
      }

      // Verify the email with the code
      setIsVerifying(true);

      try {
        const result = await userService.verifyEmailChange(code);

        setIsVerifying(false);

        if (result.success && result.data) {
          // Update user in auth store with new email
          authStore.setUser(result.data);
          setVerificationSuccess(true);
        } else {
          setVerificationError(true);
          setErrorMessage(
            result.error || 'The verification code is invalid or has expired. Please request a new one.'
          );
        }
      } catch (error) {
        console.error('Email verification error:', error);
        setIsVerifying(false);
        setVerificationError(true);
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams, authStore]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          {/* Loading State */}
          {isVerifying && (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
              <p className="text-lg font-medium">Verifying your email...</p>
              <p className="text-sm text-muted-foreground mt-2">Please wait</p>
            </div>
          )}

          {/* Success State */}
          {verificationSuccess && (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
              <p className="text-muted-foreground mb-6">
                Your email address has been successfully updated.
              </p>
              <Button onClick={goToProfile} className="w-full">
                Go to Profile
              </Button>
            </div>
          )}

          {/* Error State */}
          {verificationError && (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <XCircle className="h-16 w-16 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
              <p className="text-muted-foreground mb-6">{errorMessage}</p>
              <Button onClick={goToProfile} variant="outline" className="w-full">
                Go to Profile
              </Button>
            </div>
          )}

          {/* Invalid Link State */}
          {!isVerifying && !verificationSuccess && !verificationError && (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-16 w-16 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Invalid Link</h2>
              <p className="text-muted-foreground mb-6">
                This verification link is invalid or has expired.
              </p>
              <Button onClick={goToProfile} variant="outline" className="w-full">
                Go to Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
