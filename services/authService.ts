import type { User } from '@/types/global';

// Response types
interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    errorCode?: string;
    data?: T;
    user?: User;
    email?: string;
}

interface LoginResponse {
    user: User;
    token: string;
}

// Dummy user storage (in-memory for demo)
const STORAGE_KEY = 'dummy_auth_users';
const TOKEN_KEY = 'dummy_auth_token';
const PENDING_ACTIVATIONS_KEY = 'dummy_pending_activations';
const RESET_TOKENS_KEY = 'dummy_reset_tokens';

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get users from localStorage
const getUsers = (): User[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

// Save users to localStorage
const saveUsers = (users: User[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

// Get pending activations
const getPendingActivations = (): Record<string, { email: string; token: string }> => {
    if (typeof window === 'undefined') return {};
    const stored = localStorage.getItem(PENDING_ACTIVATIONS_KEY);
    return stored ? JSON.parse(stored) : {};
};

// Save pending activations
const savePendingActivations = (activations: Record<string, { email: string; token: string }>) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(PENDING_ACTIVATIONS_KEY, JSON.stringify(activations));
};

// Get reset tokens
const getResetTokens = (): Record<string, { email: string; token: string }> => {
    if (typeof window === 'undefined') return {};
    const stored = localStorage.getItem(RESET_TOKENS_KEY);
    return stored ? JSON.parse(stored) : {};
};

// Save reset tokens
const saveResetTokens = (tokens: Record<string, { email: string; token: string }>) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokens));
};

// Generate dummy token
const generateToken = () => {
    return 'dummy_token_' + Math.random().toString(36).substring(2, 15);
};

// Generate activation/reset token
const generateActivationToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/**
 * Dummy Auth Service
 * Simulates backend API calls with localStorage persistence
 */
export const authService = {
    /**
     * Login with email/phone and password
     */
    async login(emailOrPhone: string, password: string): Promise<ApiResponse<LoginResponse>> {
        await delay(800);

        const users = getUsers();
        const user = users.find(
            u => (u.email === emailOrPhone || u.phone === emailOrPhone) && u.password === password
        );

        if (!user) {
            return {
                success: false,
                message: 'Invalid credentials',
                errorCode: 'INVALID_CREDENTIALS',
            };
        }

        // Check if account is activated
        if (!user.isActivated) {
            return {
                success: false,
                message: 'Account not activated. Please check your email.',
                errorCode: 'ACCOUNT_NOT_ACTIVATED',
                email: user.email,
            };
        }

        const token = generateToken();

        // Store token in localStorage (simulating HTTP-only cookie from backend)
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem('current_user', JSON.stringify(user));

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        return {
            success: true,
            message: 'Login successful',
            data: {
                user: userWithoutPassword as User,
                token,
            },
        };
    },

    /**
     * Register new user
     */
    async register(
        name: string,
        email: string,
        phoneCode: string,
        phone: string,
        password: string
    ): Promise<ApiResponse> {
        await delay(1000);

        const users = getUsers();

        // Check if email already exists
        if (users.some(u => u.email === email)) {
            return {
                success: false,
                message: 'Email already registered',
                errorCode: 'EMAIL_EXISTS',
            };
        }

        // Create new user (not activated)
        const newUser: User & { password: string } = {
            id: Date.now().toString(),
            name,
            email,
            phone: phone ? `${phoneCode}${phone}` : undefined,
            isActivated: false,
            createdAt: new Date().toISOString(),
            password, // Store password for demo (never do this in production!)
        };

        users.push(newUser);
        saveUsers(users);

        // Generate activation token
        const activationToken = generateActivationToken();
        const pendingActivations = getPendingActivations();
        pendingActivations[activationToken] = { email, token: activationToken };
        savePendingActivations(pendingActivations);

        // Simulate sending activation email
        const activationLink = `${window.location.origin}/auth/activate?token=${activationToken}`;
        console.log('📧 [SIMULATED EMAIL] Activation Link:', activationLink);
        console.log('📧 To:', email);

        return {
            success: true,
            message: 'Registration successful! Please check your email to activate your account.',
        };
    },

    /**
     * Activate account with token
     */
    async activateAccount(token: string): Promise<ApiResponse<{ user: User }>> {
        await delay(600);

        const pendingActivations = getPendingActivations();
        const activation = pendingActivations[token];

        if (!activation) {
            return {
                success: false,
                message: 'Invalid or expired activation token',
                errorCode: 'INVALID_TOKEN',
            };
        }

        const users = getUsers();
        const userIndex = users.findIndex(u => u.email === activation.email);

        if (userIndex === -1) {
            return {
                success: false,
                message: 'User not found',
                errorCode: 'USER_NOT_FOUND',
            };
        }

        // Activate user
        users[userIndex].isActivated = true;
        saveUsers(users);

        // Remove from pending activations
        delete pendingActivations[token];
        savePendingActivations(pendingActivations);

        // Auto-login after activation
        const authToken = generateToken();
        localStorage.setItem(TOKEN_KEY, authToken);

        const { password: _, ...userWithoutPassword } = users[userIndex] as any;
        localStorage.setItem('current_user', JSON.stringify(userWithoutPassword));

        return {
            success: true,
            message: 'Account activated successfully!',
            data: {
                user: userWithoutPassword as User,
            },
            user: userWithoutPassword as User,
        };
    },

    /**
     * Resend activation email
     */
    async resendActivation(email: string): Promise<ApiResponse> {
        await delay(700);

        const users = getUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            return {
                success: false,
                message: 'User not found',
                errorCode: 'USER_NOT_FOUND',
            };
        }

        if (user.isActivated) {
            return {
                success: false,
                message: 'Account is already activated',
                errorCode: 'ALREADY_ACTIVATED',
            };
        }

        // Generate new activation token
        const activationToken = generateActivationToken();
        const pendingActivations = getPendingActivations();
        pendingActivations[activationToken] = { email, token: activationToken };
        savePendingActivations(pendingActivations);

        // Simulate sending activation email
        const activationLink = `${window.location.origin}/auth/activate?token=${activationToken}`;
        console.log('📧 [SIMULATED EMAIL] Activation Link:', activationLink);
        console.log('📧 To:', email);

        return {
            success: true,
            message: 'Activation email sent! Please check your inbox.',
        };
    },

    /**
     * Request password reset
     */
    async requestPasswordReset(email: string): Promise<ApiResponse> {
        await delay(700);

        const users = getUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            // Don't reveal if email exists (security best practice)
            return {
                success: true,
                message: 'If an account exists with this email, you will receive a password reset link.',
            };
        }

        // Generate reset token
        const resetToken = generateActivationToken();
        const resetTokens = getResetTokens();
        resetTokens[resetToken] = { email, token: resetToken };
        saveResetTokens(resetTokens);

        // Simulate sending reset email
        const resetLink = `${window.location.origin}/auth/reset-password?token=${resetToken}`;
        console.log('📧 [SIMULATED EMAIL] Password Reset Link:', resetLink);
        console.log('📧 To:', email);

        return {
            success: true,
            message: 'If an account exists with this email, you will receive a password reset link.',
        };
    },

    /**
     * Reset password with token
     */
    async resetPassword(token: string, newPassword: string): Promise<ApiResponse<LoginResponse>> {
        await delay(800);

        const resetTokens = getResetTokens();
        const resetData = resetTokens[token];

        if (!resetData) {
            return {
                success: false,
                message: 'Invalid or expired reset token',
                errorCode: 'INVALID_TOKEN',
            };
        }

        const users = getUsers();
        const userIndex = users.findIndex(u => u.email === resetData.email);

        if (userIndex === -1) {
            return {
                success: false,
                message: 'User not found',
                errorCode: 'USER_NOT_FOUND',
            };
        }

        // Update password
        (users[userIndex] as any).password = newPassword;
        saveUsers(users);

        // Remove used reset token
        delete resetTokens[token];
        saveResetTokens(resetTokens);

        // Auto-login after password reset
        const authToken = generateToken();
        localStorage.setItem(TOKEN_KEY, authToken);

        const { password: _, ...userWithoutPassword } = users[userIndex] as any;
        localStorage.setItem('current_user', JSON.stringify(userWithoutPassword));

        return {
            success: true,
            message: 'Password reset successful!',
            data: {
                user: userWithoutPassword as User,
                token: authToken,
            },
        };
    },

    /**
     * Logout
     */
    async logout(): Promise<ApiResponse> {
        await delay(300);

        // Clear token and user data
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem('current_user');

        return {
            success: true,
            message: 'Logged out successfully',
        };
    },

    /**
     * Get current user (from localStorage)
     */
    getCurrentUser(): User | null {
        if (typeof window === 'undefined') return null;
        const token = localStorage.getItem(TOKEN_KEY);
        const userStr = localStorage.getItem('current_user');

        if (!token || !userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },
};
