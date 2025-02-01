'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Clock, Edit, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import DeleteOrder from './DeleteOrder';
import { QueryReturnType } from '@/types';
import { ordersQuery } from '@/hooks/data/orders/getOrders/getQuery';
import CancelReason from '../../order/[orderId]/ui/cancelReason';
import ProcessOrder from '../../order/[orderId]/ui/proccessOrder';
import ConfirmOrder from '../../order/[orderId]/ui/cofirmOrder';

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
          {data.status !== 'Cancelled' && data.status !== 'Delivered' && (
            <DropdownMenuItem asChild>
              <CancelReason dropMenu id={data.id} />
            </DropdownMenuItem>
          )}
          {data.status === 'Pending' && (
            <DropdownMenuItem asChild>
              <ProcessOrder dropMenu id={data.id} />
            </DropdownMenuItem>
          )}
          {data.status === 'Processing' && (
            <DropdownMenuItem asChild>
              <ConfirmOrder dropMenu id={data.id} />
            </DropdownMenuItem>
          )}
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
