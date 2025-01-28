'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import ConfirmationWindow from './confirmationWindow';
import Link from 'next/link';
import { highlightsQuery } from '@/hooks/data/highlights/getHighlights/highlightsQuery';
import { QueryReturnType } from '@/types';
import { Tables } from '@/types/database.types';

interface CellActionProps {
  data: Tables<'highlights'>;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading] = useState(false);
  const [open, setOpen] = useState(false);

  const onConfirm = async () => {};

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Ouvrir le menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[5rem]">
          <DropdownMenuItem>
            <Link
              href={`/dashboard/highlight?slug=${data?.slug}`}
              className="flex cursor-pointer items-center justify-start gap-2 p-1"
            >
              <Edit className="h-4 w-4" />
              <div className="text-sm">Changer</div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <ConfirmationWindow slug={data?.slug ?? ''} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
