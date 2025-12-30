import type { User } from '@/types/global';

// Response types
interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    errorCode?: string;
    data?: T;
}

interface LoginResponse {
    user: User;
    token: string;
}

// Storage keys
const USERS_KEY = 'auth_users';
const TOKEN_KEY = 'auth_token';
const CURRENT_USER_KEY = 'current_user';

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate simple token
const generateToken = () => 'token_' + Math.random().toString(36).substring(2);

// Get users from localStorage
const getUsers = (): Array<User & { password: string }> => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
};

// Save users to localStorage
const saveUsers = (users: Array<User & { password: string }>) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

/**
 * Simple dummy authentication service
 */
export const authService = {
    /**
     * Login with email/phone and password
     */
    async login(emailOrPhone: string, password: string): Promise<ApiResponse<LoginResponse>> {
        await delay(500);

        const users = getUsers();
        const user = users.find(
            u => (u.email === emailOrPhone || u.phone === emailOrPhone) && u.password === password
        );

        if (!user) {
            return {
                success: false,
                message: 'Invalid email or password',
                errorCode: 'INVALID_CREDENTIALS',
            };
        }

        const token = generateToken();
        const { password: _, ...userWithoutPassword } = user;

        // Store token and user
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));

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
        await delay(500);

        const users = getUsers();

        // Check if email already exists
        if (users.some(u => u.email === email)) {
            return {
                success: false,
                message: 'Email already registered',
                errorCode: 'EMAIL_EXISTS',
            };
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            phone: phone ? `${phoneCode}${phone}` : undefined,
            isActivated: true,
            createdAt: new Date().toISOString(),
            password,
        };

        users.push(newUser);
        saveUsers(users);

        // Auto-login
        const token = generateToken();
        const { password: _, ...userWithoutPassword } = newUser;

        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));

        return {
            success: true,
            message: 'Registration successful!',
        };
    },

    /**
     * Logout
     */
    async logout(): Promise<ApiResponse> {
        await delay(200);

        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(CURRENT_USER_KEY);

        return {
            success: true,
            message: 'Logged out successfully',
        };
    },

    /**
     * Get current user
     */
    getCurrentUser(): User | null {
        if (typeof window === 'undefined') return null;

        const token = localStorage.getItem(TOKEN_KEY);
        const userStr = localStorage.getItem(CURRENT_USER_KEY);

        if (!token || !userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },
};
