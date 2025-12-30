'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { authService } from '@/features/auth/services/authService';
import { MainLayout } from '@/components/layouts';

export default function HomePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    // Check if user is logged in
    const currentUser = authService.getCurrentUser();

    if (!currentUser) {
      // Redirect to login if not authenticated
      router.push('/auth/login');
    } else {
      // Set user in store if not already set
      if (!user) {
        setUser(currentUser);
      }
    }
  }, [user, setUser, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome, {user.name}!</h1>
          <p className="text-muted-foreground">
            You're successfully logged in to the Retail System
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-card border rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-muted-foreground">Name:</span>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Email:</span>
              <p className="font-medium">{user.email}</p>
            </div>
            {user.phone && (
              <div>
                <span className="text-sm text-muted-foreground">Phone:</span>
                <p className="font-medium">{user.phone}</p>
              </div>
            )}
            <div>
              <span className="text-sm text-muted-foreground">Status:</span>
              <p className="font-medium">
                {user.isActivated ? (
                  <span className="text-green-600">✓ Activated</span>
                ) : (
                  <span className="text-yellow-600">Pending Activation</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="p-4 border rounded-lg hover:bg-accent transition-colors text-left">
              <h3 className="font-semibold mb-1">Dashboard</h3>
              <p className="text-sm text-muted-foreground">View your dashboard</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-accent transition-colors text-left">
              <h3 className="font-semibold mb-1">Settings</h3>
              <p className="text-sm text-muted-foreground">Manage your account</p>
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
