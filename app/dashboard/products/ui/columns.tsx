import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Checkbox } from '@/components/ui/checkbox';
import { productsQuery } from '@/hooks/data/products/getProducts/productsQuery';
import { QueryReturnType } from '@/types';

export const columns = ({
  selectedIds,
  setSelectedIds,
  columnState
}: {
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  columnState: {
    accessorKey: string;
    header: string;
    visible: boolean;
  }[];
}): ColumnDef<QueryReturnType<typeof productsQuery>['data'][number]>[] => [
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected()}
  //       onCheckedChange={(value) => {
  //         const allIds = table
  //           .getRowModel()
  //           .rows.map((row) => row.original.slug);
  //         setSelectedIds(value ? allIds : []);
  //         table.toggleAllPageRowsSelected(!!value);
  //       }}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={selectedIds.includes(row.original.slug)}
  //       onCheckedChange={(value) => {
  //         const slug = row.original.slug;
  //         setSelectedIds(
  //           value
  //             ? [...selectedIds, slug]
  //             : selectedIds.filter((selectedId) => selectedId !== slug)
  //         );
  //         row.toggleSelected(!!value);
  //       }}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false
  // },
  ...columnState.filter((col) => col.visible),
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
