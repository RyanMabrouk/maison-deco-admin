import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Checkbox } from '@/components/ui/checkbox';
import { QueryReturnType } from '@/types';
import { couponsQuery } from '@/hooks/data/coupons/get/getQuery';

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
}): ColumnDef<QueryReturnType<typeof couponsQuery>['data'][number]>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => {
          const allIds = table.getRowModel().rows.map((row) => row.original.id);
          setSelectedIds(value ? allIds : []);
          table.toggleAllPageRowsSelected(!!value);
        }}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={selectedIds.includes(row.original.id)}
        onCheckedChange={(value) => {
          const id = row.original.id;
          setSelectedIds(
            value
              ? [...selectedIds, id]
              : selectedIds.filter((selectedId) => selectedId !== id)
          );
          row.toggleSelected(!!value);
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  ...columnState.filter((col) => col.visible),
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
