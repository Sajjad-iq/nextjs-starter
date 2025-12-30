import { MainLayout } from '@/components/layouts';

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
