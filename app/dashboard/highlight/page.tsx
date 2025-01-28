'use client';
import React from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import { useSearchParams } from 'next/navigation';
import Highlight from './ui/highlight';

export default function Page() {
  const breadcrumbItems = [
    { title: 'Statistiques', link: '/dashboard' },
    { title: 'Sélections spéciales', link: '/dashboard/selections-speciales' }
  ];
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');
  return (
    <PageContainer>
      <div className="mx-auto   w-full max-w-[50rem] border bg-white p-5 shadow-md md:p-10 ">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="mb-4 mt-5 text-2xl font-bold ">
          {slug
            ? 'Modifier la sélection spéciale'
            : 'Ajouter une sélection spéciale'}
        </h1>
        <Highlight />
      </div>
    </PageContainer>
  );
}
