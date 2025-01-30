'use client';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import ProductsComponent from './ui/ProductsComponent';

const breadcrumbItems = [
  { title: 'Statistiques', link: '/dashboard' },
  { title: 'Produits', link: '/dashboard/products' }
];

export default function Page() {
  return (
    <PageContainer>
      <div className="space-y-2 bg-white p-5 shadow-md md:p-10">
        <Breadcrumbs items={breadcrumbItems} />
        <ProductsComponent />
      </div>
    </PageContainer>
  );
}
