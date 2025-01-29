import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import BaseComponent from './ui/BaseComponent';

const breadcrumbItems = [
  { title: 'Statistiques', link: '/dashboard' },
  { title: 'Coupons', link: '/dashboard/coupons' }
];

export default function page() {
  return (
    <PageContainer>
      <div className="space-y-2 bg-white p-5 shadow-md md:p-10">
        <Breadcrumbs items={breadcrumbItems} />
        <BaseComponent />
      </div>
    </PageContainer>
  );
}
