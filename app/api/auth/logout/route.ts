import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@/lib/types/global';

export async function POST(request: NextRequest) {
    // Create response
    const response = NextResponse.json<ApiResponse>({
        success: true,
        message: 'Logged out successfully',
    });

    // Delete cookies
    response.cookies.delete('auth_token');
    response.cookies.delete('current_user');

    return response;
}
