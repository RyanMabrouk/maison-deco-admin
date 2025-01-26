import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import Events from './ui/events';
const breadcrumbItems = [
  { title: 'إحصائيات', link: '/dashboard' },
  { title: 'الفعاليات', link: '/dashboard/events' }
];
export default function page() {
  return (
    <PageContainer>
      <div className="space-y-2 bg-white p-5 shadow-md md:p-10">
        {/* <Breadcrumbs items={breadcrumbItems} />
        <Events /> */}
      </div>
    </PageContainer>
  );
}
