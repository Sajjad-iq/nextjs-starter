import { MainLayout } from '@/components/layouts';

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <MainLayout>{children}</MainLayout>;
}
