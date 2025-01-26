'use client';
import React from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { useSearchParams } from 'next/navigation';
// import Event from './ui/event';

export default function Page() {
  const breadcrumbItems = [
    { title: 'إحصائيات', link: '/dashboard' },
    { title: 'فعالية', link: '/dashboard/event' }
  ];
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');
  return (
    <PageContainer>
      <div className="mx-auto   w-full max-w-[50rem] border bg-white p-5 shadow-md md:p-10 ">
        {/* <Breadcrumbs items={breadcrumbItems} />
        <h1 className="mb-4 mt-5 text-2xl font-bold ">
          {eventId ? 'تعديل الفعالية' : 'إضافة فعالية'}{' '}
        </h1>
        <Event /> */}
      </div>
    </PageContainer>
  );
}
