import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Checkbox } from '@/components/ui/checkbox';
import { QueryReturnType } from '@/types';
import { ordersQuery } from '@/hooks/data/orders/getOrders/getQuery';

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
}): ColumnDef<QueryReturnType<typeof ordersQuery>['data'][number]>[] => [
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected()}
  //       onCheckedChange={(value) => {
  //         const allIds = table.getRowModel().rows.map((row) => row.original.id);
  //         setSelectedIds(value ? allIds : []);
  //         table.toggleAllPageRowsSelected(!!value);
  //       }}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={selectedIds.includes(row.original.id)}
  //       onCheckedChange={(value) => {
  //         const slug = row.original.id;
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
