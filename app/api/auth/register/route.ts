import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@/lib/types/global';

// Shared user storage (same as login)
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
        const { name, email, phone, password } = body;

        // Check if email exists
        if (users.some(u => u.email === email)) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: 'Email already registered', errorCode: 'EMAIL_EXISTS' },
                { status: 400 }
            );
        }

        // Create new user (phone is already combined like "+964 7501234567")
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            phone: phone || undefined,
            password,
            isActivated: true,
            createdAt: new Date().toISOString(),
        };

        users.push(newUser);

        // Remove password from response
        const { password: _, ...userWithoutPassword } = newUser;

        // Generate dummy token
        const token = 'token_' + Math.random().toString(36).substring(2);

        // Create response
        const response = NextResponse.json<ApiResponse>({
            success: true,
            message: 'Registration successful!',
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
