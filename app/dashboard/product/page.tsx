'use client';
import React from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import Form from './ui/form';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');

  const pageTitle = productId
    ? 'Modifier le produit'
    : 'Créer un nouveau produit';

  const breadcrumbItems = [
    { title: 'Statistiques', link: '/dashboard' },
    {
      title: 'Produits',
      link: `/dashboard/products`
    },
    {
      title: pageTitle,
      link: `/dashboard/product`
    }
  ];

  return (
    <PageContainer>
      <div className="mx-auto w-full max-w-[50rem] border bg-white p-5 shadow-md md:p-10">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="mb-4 mt-5 text-2xl font-bold">{pageTitle}</h1>
        <Form />
      </div>
    </PageContainer>
  );
}
