import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from './_data';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '0');
    const size = parseInt(searchParams.get('size') || '10');
    const search = searchParams.get('search') || '';

    // Filter by search
    let filteredUsers = mockUsers;
    if (search) {
        const searchLower = search.toLowerCase();
        filteredUsers = mockUsers.filter(user =>
            user.name.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower)
        );
    }

    // Calculate pagination
    const totalElements = filteredUsers.length;
    const totalPages = Math.ceil(totalElements / size);
    const start = page * size;
    const end = start + size;
    const paginatedUsers = filteredUsers.slice(start, end);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json({
        success: true,
        data: {
            content: paginatedUsers,
            page,
            size,
            totalElements,
            totalPages,
        },
    });
}

// POST /api/users - Create user
export async function POST(request: NextRequest) {
    const body = await request.json();

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const newUser = {
        id: `user-${Date.now()}`,
        name: body.name,
        email: body.email,
        phone: body.phone || '',
        role: body.role || 'user',
        status: body.status || 'active',
        createdAt: new Date().toISOString(),
    };

    mockUsers.unshift(newUser);

    return NextResponse.json({
        success: true,
        message: 'User created successfully',
        data: newUser,
    });
}
