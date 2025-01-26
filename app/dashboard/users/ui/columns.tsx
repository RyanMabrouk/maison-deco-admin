import { ColumnDef } from '@tanstack/react-table';
import { Tables } from '@/types/database.types';
import { CellAction } from './cell-action';
import Image from 'next/image';

export const columns: ColumnDef<Tables<'users'>>[] = [
  {
    accessorKey: 'avatar',
    header: 'Avatar',
    cell: ({ row }) => (
      <div className="flex items-center">
        <Image
          src={row.original.avatar ?? '/noAvatar.jpg'}
          alt=""
          className="h-11 w-11 rounded-full"
          width={64}
          height={64}
        />
      </div>
    )
  },
  {
    accessorKey: 'full_name',
    header: 'Nom complet'
  },
  {
    accessorKey: 'email',
    header: 'Adresse e-mail'
  },
  {
    accessorKey: 'role',
    header: 'Role'
  },
  {
    accessorKey: 'date_of_birth',
    header: 'Date de naissance'
  },
  {
    accessorKey: 'phone',
    header: 'Numéro de téléphone'
  },

  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
