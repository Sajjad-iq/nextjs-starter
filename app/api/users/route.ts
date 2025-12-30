import { NextRequest, NextResponse } from 'next/server';

// Mock users data
const mockUsers = Array.from({ length: 100 }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    phone: `+964 750${String(1000000 + i).slice(1)}`,
    role: i % 3 === 0 ? 'admin' : i % 3 === 1 ? 'manager' : 'user',
    status: i % 4 === 0 ? 'inactive' : 'active',
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
}));

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
