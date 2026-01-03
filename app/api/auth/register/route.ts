import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@/lib/types/global';
import { mockUsers } from '../../users/_data';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, password } = body;

        // Check if email exists
        if (mockUsers.some(u => u.email === email)) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: 'Email already registered', errorCode: 'EMAIL_EXISTS' },
                { status: 400 }
            );
        }

        // Check if phone exists (if provided)
        if (phone && mockUsers.some(u => u.phone === phone)) {
            return NextResponse.json<ApiResponse>(
                { success: false, message: 'Phone number already registered', errorCode: 'PHONE_EXISTS' },
                { status: 400 }
            );
        }

        // Create new user
        const newUser = {
            id: `user-${mockUsers.length + 1}`,
            name,
            email,
            phone: phone || `+964 750${String(1000000 + mockUsers.length).slice(1)}`,
            role: 'user' as const,
            status: 'active' as const,
            createdAt: new Date().toISOString(),
        };

        // Add to mock users
        mockUsers.push(newUser);

        // Generate dummy token
        const token = 'token_' + Math.random().toString(36).substring(2);

        // Prepare user data for response
        const userData = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
            status: newUser.status,
            isActivated: true,
            createdAt: newUser.createdAt,
        };

        // Create response
        const response = NextResponse.json<ApiResponse>({
            success: true,
            message: 'Registration successful!',
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
