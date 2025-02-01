'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { SearchIcon } from 'lucide-react';
import Pagination from '@mui/material/Pagination';
import { Player } from '@lottiefiles/react-lottie-player';
import SelectGeneric from './selectGeneric';
import { InfinityPaginationResultType } from '@/helpers/infinityPagination';
import { useEffect, useState } from 'react';

interface DataTableProps<TData, TValue, TFilter extends string> {
  columns: ColumnDef<TData, TValue>[];
  searchColumnName: string;
  onSearchChange: (query: string) => void;
  pagination_data: InfinityPaginationResultType<TData> | undefined;
  setPage: (page: number) => void;
  tableName?: string;
  isLoading?: boolean;
  filter?: {
    value: TFilter;
    options: { label: string; value: TFilter }[];
    placeholder: string;
    seFilter: (filter: TFilter) => void;
  };
}

export function GenericTableData<TData, TValue, TFilter extends string>({
  columns,
  searchColumnName,
  pagination_data,
  onSearchChange,
  setPage,
  isLoading,
  filter
}: DataTableProps<TData, TValue, TFilter>) {
  const table = useReactTable({
    data: pagination_data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (!isLoading) {
      onSearchChange(searchQuery);
      setPage(1);
    }
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [filter?.value]);

  return (
    <div className="z-0 overflow-visible">
      <div className="z-0 flex items-center gap-2 overflow-visible">
        <div className="m-2 flex h-11 w-full max-w-md flex-row items-center gap-2 rounded-md border border-gray-300 bg-white shadow-sm">
          <input
            type="search"
            placeholder={`Rechercher par ${searchColumnName} ...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Updated to set inputValue
            className="w-full rounded-lg p-2 placeholder:text-[0.9rem] focus:outline-none"
          />
          <button className="flex h-full cursor-default items-center justify-center rounded-lg p-2 transition-colors">
            <SearchIcon size={15} />
          </button>
        </div>
        <span className="-mt-2">
          {filter && filter.options.length > 0 && (
            <SelectGeneric
              options={filter.options}
              placeholder={filter.placeholder}
              selectedValue={filter.value}
              setSelectedValue={
                filter.seFilter as ((option: string) => void) | undefined
              }
            />
          )}
        </span>
      </div>
      {isLoading ? (
        <div className="m-auto mt-[10%] flex h-full w-full max-w-[40rem] items-center justify-center rounded-md">
          <Player
            className="m-auto"
            autoplay
            loop
            src="/loading.json"
            style={{ height: '10rem', width: '10rem' }}
          />
        </div>
      ) : table.getRowModel().rows.length === 0 ? (
        <div className="m-auto mt-[5%] flex h-full w-full max-w-[40rem] items-center justify-center rounded-md">
          <Player
            src={
              'https://lottie.host/85fb7313-2848-45c2-bdb9-2b729f57afc2/AwfmWMtW8n.json'
            }
            className="mx-auto mt-[50%] h-60 w-60"
            loop
            autoplay
          />
        </div>
      ) : (
        <Table className="relative z-0 !overflow-visible">
          <TableHeader className="bg-color3 font-semibold">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="w-fit text-color1 hover:bg-color3"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="w-fit whitespace-nowrap px-4 py-3 text-center font-bold text-color1 hover:bg-color3"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="z-0 max-h-[30rem] !overflow-visible">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  className="z-0 !overflow-visible"
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="z-0 w-min max-w-[15rem] px-4"
                    >
                      <div
                        className={`tooltip flex h-fit max-w-[15rem] items-center justify-center text-left before:z-[1000] after:z-[1000] ${
                          table.getRowModel().rows.length / 2 <= index
                            ? 'tooltip-top'
                            : 'tooltip-bottom'
                        }`}
                        data-tip={cell.getValue()}
                      >
                        <span className="max-w-[15rem]">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </span>
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {!isLoading && (
        <div className="relative flex w-full items-center justify-center space-x-2 space-x-reverse py-4">
          <div className="absolute inset-y-0 right-0 top-1/3 flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} sur{' '}
            {table.getFilteredRowModel().rows.length} ligne(s) sélectionnée(s)
          </div>

          <div className="space-x-2">
            <Pagination
              dir="ltr"
              className="flex w-full justify-center"
              count={pagination_data?.meta.total_pages ?? 1}
              page={pagination_data?.meta.page ?? 1}
              boundaryCount={1}
              onChange={(e, value) => setPage(value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
