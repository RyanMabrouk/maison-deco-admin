'use client';
import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { columns } from './columns';
import { usePagination } from '../context/usePagination';
import { GenericTableData } from '@/components/genericTableData';
import { Separator } from '@/components/ui/separator';
import { SwitchGeneric } from '@/components/switchGeneric';
import useProducts from '@/hooks/data/products/getProducts/useProducts';
import { productsQuery } from '@/hooks/data/products/getProducts/productsQuery';
import Image from 'next/image';

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
      accessorKey: 'thumbnail',
      header: 'Thumbnail',
      visible: true,
      cell: ({ row }) => (
        <div className="flex items-center">
          <Image
            src={row.original.thumbnail ?? '/noAvatar.jpg'}
            alt=""
            className="h-11 w-11 rounded-full"
            width={64}
            height={64}
          />
        </div>
      )
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
      visible: true,
      cell: ({ row }) => (
        <div className=" text-left font-semibold hover:underline">
          {row.original.slug}
        </div>
      )
    },
    {
      accessorKey: 'is_published',
      header: 'Is Published',
      visible: true
    },
    {
      accessorKey: 'status',
      header: 'Status',
      visible: true
    },

    {
      accessorKey: 'price_after_discount',
      header: 'Price',
      visible: true
    },
    {
      accessorKey: 'discount',
      header: 'Discount',
      visible: true,
      cell: ({ row }) => (
        <span>
          {row.original.discount_type === 'amount'
            ? `${row.original.discount}€`
            : `${row.original.discount}%`}
        </span>
      )
    },
    {
      accessorKey: 'stock',
      header: 'Stock',
      visible: true
    },
    {
      accessorKey: 'created_at',
      header: 'Created At',
      visible: true,
      cell: ({ row }) => (
        <div>{new Date(row.original.created_at ?? '').toLocaleString()}</div>
      )
    }
  ]);

  const { data: products, isLoading } = useProducts(filter);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (products?.meta?.has_next_page) {
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
  }, [filter.pagination.page, products?.meta?.has_next_page]);

  const toggleColumnVisibility = (accessorKey: string) => {
    setColumnState((prevState) =>
      prevState.map((col) =>
        col.accessorKey === accessorKey
          ? { ...col, visible: !col.visible }
          : col
      )
    );
  };

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
        searchColumnName="slug"
        pagination_data={products}
        columns={columns({
          selectedIds,
          setSelectedIds,
          columnState
        })}
        onSearchChange={(searchQuery) => {
          setFilter((prev) => ({
            ...prev,
            ilike: {
              ...prev.ilike,
              slug: searchQuery
            }
          }));
        }}
        setPage={(page) => {
          setFilter((prev) => ({
            ...prev,
            pagination: {
              ...prev.pagination,
              page
            }
          }));
        }}
        isLoading={isLoading}
      />
    </div>
  );
}
