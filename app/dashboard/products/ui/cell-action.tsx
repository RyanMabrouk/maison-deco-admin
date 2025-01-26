'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import DeleteProduct from './DeleteProduct';
import { QueryReturnType } from '@/types';
import { productByIdQuery } from '@/hooks/data/products/getProductById/productByIdQuery';

interface CellActionProps {
  data: QueryReturnType<typeof productByIdQuery>['data'];
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
              href={`/dashboard/product?productId=${data?.slug}`}
              className="flex cursor-pointer items-center justify-start gap-2 p-2"
            >
              <Edit className="h-4 w-4" />
              <div className="text-sm">Changer</div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <DeleteProduct slug={data?.slug} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
