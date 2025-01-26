'use client';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import Details from './ui/details';
import { useParams } from 'next/navigation';
import ConfirmationWindow from './ui/confirmationWindow';

const breadcrumbItems = [
  { title: 'Statistiques', link: '/dashboard' },
  { title: 'Commande', link: '/dashboard/order' }
];

export default function Page() {
  const { orderId } = useParams();

  return (
    <PageContainer>
      <div className="space-y-2 bg-color3  py-5">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={`Détails de la commande`}
            description="Tous les détails de la commande"
          />
          <ConfirmationWindow orderId={String(orderId)} />
        </div>
      </div>
      <Details id={String(orderId)} />
    </PageContainer>
  );
}
