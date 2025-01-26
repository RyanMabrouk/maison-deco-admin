'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import DeleteOrder from './DeleteOrder';
import { QueryReturnType } from '@/types';
import { ordersQuery } from '@/hooks/data/orders/getOrders/getQuery';

interface CellActionProps {
  data: QueryReturnType<typeof ordersQuery>['data'][number];
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Ouvrir le menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="min-w-[7rem] max-w-[7rem]"
        >
          <DropdownMenuItem asChild>
            <Link
              href={`/dashboard/order/${data?.id}`}
              className="flex cursor-pointer items-center justify-start gap-2 p-2"
            >
              <Edit className="h-4 w-4" />
              <div className="text-sm">Changer</div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <DeleteOrder id={data?.id} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
