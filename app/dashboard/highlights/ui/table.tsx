'use client';
import React from 'react';
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
