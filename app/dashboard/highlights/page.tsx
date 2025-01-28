import { Breadcrumbs } from '@/components/breadcrumbs';
import Highlights from './ui/highlights';
import PageContainer from '@/components/layout/page-container';
import { PaginationProvider } from './context/usePagination';

const breadcrumbItems = [
  { title: 'Statistiques', link: '/dashboard' },
  { title: 'Sélections spéciales', link: '/dashboard/highlights' }
];

export default function page() {
  return (
    <PageContainer>
      <div className="space-y-2 bg-white p-5 shadow-md md:p-10">
        <Breadcrumbs items={breadcrumbItems} />
        <PaginationProvider>
          <Highlights />
        </PaginationProvider>
      </div>
    </PageContainer>
  );
}
