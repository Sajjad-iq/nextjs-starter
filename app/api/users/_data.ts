// Shared mock users data
export const mockUsers = Array.from({ length: 100 }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    phone: `+964 750${String(1000000 + i).slice(1)}`,
    role: i % 3 === 0 ? 'admin' : i % 3 === 1 ? 'manager' : 'user',
    status: i % 4 === 0 ? 'inactive' : 'active',
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
}));
