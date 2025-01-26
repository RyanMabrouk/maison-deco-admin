'use client';
import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { columns } from './columns';
import { usePagination } from '../context/usePagination';
import { GenericTableData } from '@/components/genericTableData';
import { Separator } from '@/components/ui/separator';
import { SwitchGeneric } from '@/components/switchGeneric';
import { productsQuery } from '@/hooks/data/products/getProducts/productsQuery';
import useOrders from '@/hooks/data/orders/getOrders/useGet';
import { Enums } from '@/types/database.types';
import { statusConfig } from '../../order/[orderId]/ui/status';

export default function Table() {
  const { filter, setFilter } = usePagination();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [columnState, setColumnState] = useState<
    {
      accessorKey: string;
      header: string;
      visible: boolean;
      cell?: ReturnType<typeof columns>[number]['cell'];
    }[]
  >([
    {
      accessorKey: 'id',
      header: 'Identifiant',
      visible: true
    },
    {
      accessorKey: 'user_id',
      header: 'ID Utilisateur',
      visible: false
    },
    {
      accessorKey: 'tax',
      header: 'Taxe(%)',
      visible: true,
      cell: ({ row }) => <div>{row.original.tax}%</div>
    },
    {
      accessorKey: 'total_price',
      header: 'Prix Total',
      visible: true
    },
    {
      accessorKey: 'shipping_address',
      header: 'Adresse de Livraison',
      visible: true
    },
    {
      accessorKey: 'delivered_at',
      header: 'Livré le',
      visible: true,
      cell: ({ row }) => (
        <div>
          {row.original.delivered_at
            ? new Date(row.original.delivered_at).toLocaleString()
            : 'Non Livré'}
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      visible: true,
      cell: ({ row }) => (
        <div
          className={`flex items-center gap-2 rounded-md p-2 text-gray-50 ${
            statusConfig[row.original.status].color ?? ''
          }`}
        >
          {statusConfig[row.original.status].icon}
          <span className="text-nowrap">
            {statusConfig[row.original.status].text}
          </span>
        </div>
      )
    },
    {
      accessorKey: 'created_at',
      header: 'Créé le',
      visible: false,
      cell: ({ row }) => (
        <div>{new Date(row.original.created_at ?? '').toLocaleString()}</div>
      )
    },
    {
      accessorKey: 'updated_at',
      header: 'Mis à Jour le',
      visible: false,
      cell: ({ row }) => (
        <div>{new Date(row.original.updated_at ?? '').toLocaleString()}</div>
      )
    },
    {
      accessorKey: 'total_price_before_discount',
      header: 'Prix Total Avant Réduction',
      visible: false
    },
    {
      accessorKey: 'total_price_after_discount',
      header: 'Prix Total Après Réduction',
      visible: false
    },
    {
      accessorKey: 'delivery_fee',
      header: 'Frais de Livraison',
      visible: false
    },
    {
      accessorKey: 'payment_method',
      header: 'Méthode de Paiement',
      visible: true
    }
  ]);

  const { data: orders, isLoading } = useOrders(filter);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (orders?.meta?.has_next_page) {
      queryClient.prefetchQuery(
        productsQuery({
          ...filter,
          pagination: {
            ...filter.pagination,
            page: filter.pagination.page + 1
          }
        })
      );
    }
  }, [filter.pagination.page, orders?.meta?.has_next_page]);

  const toggleColumnVisibility = (accessorKey: string) => {
    setColumnState((prevState) =>
      prevState.map((col) =>
        col.accessorKey === accessorKey
          ? { ...col, visible: !col.visible }
          : col
      )
    );
  };

  const statuses: { value: Enums<'order_status'>; label: string }[] = [
    { value: 'Pending', label: 'En Attente' },
    { value: 'Processing', label: 'En Cours' },
    { value: 'Delivered', label: 'Livré' },
    { value: 'Cancelled', label: 'Annulé' }
  ];
  return (
    <div>
      <h1 className="mt-4 text-xl font-semibold">
        Configurer l&apos;affichage du tableau
      </h1>

      <div className="flex flex-wrap gap-4 pb-5 pt-3">
        {columnState.map((col) => (
          <SwitchGeneric
            key={col.accessorKey}
            label={col.header}
            checked={col.visible}
            onChange={() => toggleColumnVisibility(col.accessorKey)}
          />
        ))}
      </div>
      <Separator />
      <GenericTableData
        searchColumnName="identifient"
        pagination_data={orders}
        columns={columns({
          selectedIds,
          setSelectedIds,
          columnState
        })}
        setSearchQuery={(searchQuery) => {
          // setFilter({
          //   ...filter,
          //   ilike: {
          //     id: searchQuery
          //   }
          // });
        }}
        setPage={(page) => {
          setFilter({
            ...filter,
            pagination: {
              ...filter.pagination,
              page
            }
          });
        }}
        searchQuery={filter.ilike?.id ?? ''}
        isLoading={isLoading}
        filter={{
          value: filter.match?.status ?? 'Pending',
          options: statuses,
          placeholder: 'Filtrer par statut',
          seFilter: (status) => {
            // setFilter((prev) => ({
            //   ...prev,
            //   match: {
            //     ...prev.match,
            //     status
            //   }
            // }));
          }
        }}
      />
    </div>
  );
}
