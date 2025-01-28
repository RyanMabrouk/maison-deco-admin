import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Tables } from '@/types/database.types';

export const columns: ColumnDef<Tables<'highlights'>>[] = [
  {
    accessorKey: 'slug',
    header: 'Slug'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
