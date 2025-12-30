'use client';

import { useMemo } from 'react';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/dataTable';
import { Button } from '@/components/ui/button';
import { useUsers } from '../hooks/useUsers';
import { createUsersColumns } from '../lib/usersColumns';
import { UserDialog } from '../components/UserDialog';

export default function UsersPage() {
    const {
        users,
        isLoading,
        refetch,
        pagination,
        onPageChange,
        onPageSizeChange,
    } = useUsers();

    const columns = useMemo(
        () => createUsersColumns({ onSuccess: refetch }),
        [refetch]
    );

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Users</h1>
                    <p className="text-muted-foreground">Manage system users</p>
                </div>
                <UserDialog onSuccess={refetch}>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                    </Button>
                </UserDialog>
            </div>

            <div className="flex-1 min-h-0">
                <DataTable
                    data={users}
                    columns={columns}
                    isLoading={isLoading}
                    onRetry={refetch}
                    pagination={pagination}
                    onPageChange={onPageChange}
                    onPageSizeChange={onPageSizeChange}
                />
            </div>
        </div>
    );
}
