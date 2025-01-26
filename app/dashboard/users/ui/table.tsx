'use client';
import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { columns } from './columns';
import { GenericTableData } from '@/components/genericTableData';
import useUsers from '@/hooks/data/users/getUsers/useUsers';
import { usersQuery } from '@/hooks/data/users/getUsers/usersQuery';
import { usePagination } from '../context/usePagination';

export default function Table() {
  const { filter, setFilter } = usePagination();

  const { data: users, isLoading } = useUsers(filter);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (users?.meta.has_next_page) {
      queryClient.prefetchQuery(
        usersQuery({
          ...filter,
          pagination: {
            ...filter.pagination,
            page: filter.pagination.page + 1
          }
        })
      );
    }
  }, [filter.pagination.page, users?.meta?.has_next_page, queryClient]);

  return (
    <div>
      <GenericTableData
        searchColumnName="email"
        pagination_data={users}
        columns={columns}
        setPage={(page) => {
          setFilter({
            ...filter,
            pagination: {
              ...filter.pagination,
              page
            }
          });
        }}
        searchQuery={filter.ilike?.['email'] ?? ''}
        setSearchQuery={(searchQuery) => {
          // setFilter({
          //   ...filter,
          //   ilike: {
          //     email: searchQuery
          //   }
          // });
        }}
        isLoading={isLoading}
      />
    </div>
  );
}
