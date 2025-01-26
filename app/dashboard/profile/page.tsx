import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import Form from './ui/form';

const breadcrumbItems = [
  { title: 'Statistiques', link: '/dashboard' },
  { title: 'Compte', link: '/dashboard/profile' }
];

export default function page() {
  return (
    <PageContainer>
      <div
        dir="ltr"
        className="mx-auto   w-full max-w-[50rem] border bg-white p-5 shadow-md md:p-10 "
      >
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="mb-4 mt-5 text-2xl font-bold ">Modifier le compte</h1>
        <Form />
      </div>
    </PageContainer>
  );
}
