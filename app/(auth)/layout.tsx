import { BlankLayout } from '@/components/layouts';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <BlankLayout>{children}</BlankLayout>;
}
