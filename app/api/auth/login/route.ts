import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@/lib/types/global';
import { mockUsers } from '../../users/_data';

// Default password for all mock users
const DEFAULT_PASSWORD = 'password';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { emailOrPhone, password } = body;

        // Find user by email or phone
        const user = mockUsers.find(
            u => u.email === emailOrPhone || u.phone === emailOrPhone
        );

        if (!user) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: 'Invalid email or password', errorCode: 'INVALID_CREDENTIALS' },
                { status: 401 }
            );
        }

        // Check password (all mock users use 'password')
        if (password !== DEFAULT_PASSWORD) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: 'Invalid email or password', errorCode: 'INVALID_CREDENTIALS' },
                { status: 401 }
            );
        }

        // Generate dummy token
        const token = 'token_' + Math.random().toString(36).substring(2);

        // Prepare user data for response
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status,
            isActivated: user.status === 'active',
            createdAt: user.createdAt,
        };

        // Create response
        const response = NextResponse.json<ApiResponse>({
            success: true,
            message: 'Login successful',
            data: {
                user: userData,
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

        response.cookies.set('current_user', JSON.stringify(userData), {
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
