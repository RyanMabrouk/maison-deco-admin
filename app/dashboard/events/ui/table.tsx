'use client';
import React, { useState } from 'react';
import { columns } from './columns';
import { GenericTableData } from '@/components/genericTableData';
// import useEvents from '@/hooks/data/events/useEvents';
export default function Table() {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [page, setPage] = useState<number>(1);
  // const { data: events, isLoading } = useEvents();
  return (
    <div>
      {/* <GenericTableData
        data={events?.data?? []}
        columns={columns} 
        setSearchQuery={setSearchQuery}
        page={page}
        setPage={setPage}
        searchQuery={searchQuery}
        isLoading={isLoading}

      /> */}
    </div>
  );
}
