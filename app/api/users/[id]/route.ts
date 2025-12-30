import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '../_data';

// GET /api/users/[id] - Get user by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const user = mockUsers.find(u => u.id === id);

    if (!user) {
        return NextResponse.json(
            { success: false, message: 'User not found', errorCode: 'NOT_FOUND' },
            { status: 404 }
        );
    }

    return NextResponse.json({
        success: true,
        data: user,
    });
}

// PUT /api/users/[id] - Update user
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const userIndex = mockUsers.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return NextResponse.json(
            { success: false, message: 'User not found', errorCode: 'NOT_FOUND' },
            { status: 404 }
        );
    }

    // Update user
    mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...body,
        id, // Prevent ID change
    };

    return NextResponse.json({
        success: true,
        message: 'User updated successfully',
        data: mockUsers[userIndex],
    });
}
