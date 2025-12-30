'use client';

import { DataTable } from '@/components/dataTable';
import { useUsers } from '../hooks/useUsers';
import { usersColumns } from '../lib/usersColumns';

export default function UsersPage() {
    const {
        users,
        isLoading,
        refetch,
        serverPagination,
        onPaginate,
    } = useUsers();

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Users</h1>
                <p className="text-muted-foreground">Manage system users</p>
            </div>

            <div className="flex-1 min-h-0">
                <DataTable
                    data={users}
                    columns={usersColumns}
                    serverPagination={serverPagination}
                    onPaginate={onPaginate}
                    isLoading={isLoading}
                    onRetry={() => refetch()}
                />
            </div>
        </div>
    );
}
