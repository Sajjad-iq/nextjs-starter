import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@/types/global';

// Dummy user storage (in-memory)
const users: Array<{
    id: string;
    name: string;
    email: string;
    phone?: string;
    password: string;
    isActivated: boolean;
    createdAt: string;
}> = [];

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { emailOrPhone, password } = body;

        // Find user
        const user = users.find(
            u => (u.email === emailOrPhone || u.phone === emailOrPhone) && u.password === password
        );

        if (!user) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: 'Invalid email or password', errorCode: 'INVALID_CREDENTIALS' },
                { status: 401 }
            );
        }

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        // Generate dummy token
        const token = 'token_' + Math.random().toString(36).substring(2);

        // Create response
        const response = NextResponse.json<ApiResponse>({
            success: true,
            message: 'Login successful',
            data: {
                user: userWithoutPassword,
                token,
            },
        });

        // Set HTTP-only cookies
        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        response.cookies.set('current_user', JSON.stringify(userWithoutPassword), {
            httpOnly: false, // Accessible by client for UI
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;
    } catch (error) {
        return NextResponse.json<ApiResponse>(
            { success: false, message: 'Invalid request', errorCode: 'BAD_REQUEST' },
            { status: 400 }
        );
    }
}
