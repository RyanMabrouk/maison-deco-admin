import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import Users from './ui/users';
import { PaginationProvider } from './context/usePagination';

const breadcrumbItems = [
  { title: 'Statistiques', link: '/dashboard' },
  { title: 'Utilisateurs', link: '/dashboard/users' }
];

export default function page() {
  return (
    <PageContainer>
      <div className="space-y-2 bg-white p-5 shadow-md md:p-10" dir="ltr">
        <Breadcrumbs items={breadcrumbItems} />
        <PaginationProvider>
          <Users />
        </PaginationProvider>
      </div>
    </PageContainer>
  );
}
