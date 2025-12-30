'use client';

import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';

interface MainLayoutProps {
    children: ReactNode;
}

/**
 * Main Layout
 * Used for authenticated pages
 * Includes sidebar with navigation
 */
export function MainLayout({ children }: MainLayoutProps) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <AppSidebar />
                <main className="flex-1">
                    {/* Header with sidebar trigger */}
                    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <div className="flex h-14 items-center gap-4 px-4">
                            <SidebarTrigger />
                            <h1 className="text-lg font-semibold">Retail System</h1>
                        </div>
                    </header>

                    {/* Main Content */}
                    <div className="container py-6">
                        {children}
                    </div>

                    {/* Footer */}
                    <footer className="border-t py-6 mt-auto">
                        <div className="container text-center text-sm text-muted-foreground">
                            <p>© 2024 Retail System. All rights reserved.</p>
                        </div>
                    </footer>
                </main>
            </div>
        </SidebarProvider>
    );
}
