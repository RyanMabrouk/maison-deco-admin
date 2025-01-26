import PageContainer from '@/components/layout/page-container';
import OrdersComponent from './ui/OrdersComponent';
import { Breadcrumbs } from '@/components/breadcrumbs';

const breadcrumbItems = [
  { title: 'Statistiques', link: '/dashboard' },
  { title: 'Commandes', link: '/dashboard/orders' }
];

export default function page() {
  return (
    <PageContainer>
      <div className="space-y-2 bg-white p-5 shadow-md md:p-10">
        <Breadcrumbs items={breadcrumbItems} />
        <OrdersComponent />
      </div>
    </PageContainer>
  );
}
