'use client';
import React, { useState } from 'react';
import { columns } from './columns';
import { GenericTableData } from '@/components/genericTableData';
import { usePagination } from '../context/usePagination';
import useHighlights from '@/hooks/data/highlights/getHighlights/useHighlights';

export default function Table() {
  const { filter, setFilter } = usePagination();
  const { data: highlights, isLoading } = useHighlights(filter);
  return (
    <div>
      <GenericTableData
        searchColumnName="slug"
        pagination_data={highlights}
        columns={columns}
        setSearchQuery={(searchQuery) => {
          // setFilter({
          //   ...filter,
          //   ilike: {
          //     slug: searchQuery
          //   }
          // });
        }}
        searchQuery={filter.ilike?.slug ?? ''}
        setPage={(page) => {
          setFilter({
            ...filter,
            pagination: {
              ...filter.pagination,
              page
            }
          });
        }}
        isLoading={isLoading}
      />
    </div>
  );
}
