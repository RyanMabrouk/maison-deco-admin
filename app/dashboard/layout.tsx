import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { redirect } from 'next/navigation';
import AuthGuard from '../guard/authGard';
import getSession from '@/api/getSession';

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { session } = await getSession();
  if (!session) redirect('/');
  return (
    <div className="flex flex-row">
      <AuthGuard>
        <Sidebar className="min-h-screen" />
        <main className="w-full flex-1 overflow-hidden  bg-color3">
          <Header />
          {children}
        </main>
      </AuthGuard>
    </div>
  );
}
