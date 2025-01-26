'use client';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import Table from './table';
import AddAdmin from './addAdmin';
import useUsers from '@/hooks/data/users/getUsers/useUsers';
import { usePagination } from '../context/usePagination';

export default function Users() {
  const { filter } = usePagination();

  const { data: users, isLoading } = useUsers(filter);
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Utilisateurs (${isLoading ? 0 : users?.meta?.total_count})`}
          description="Liste de tous les utilisateurs"
        />
        <AddAdmin />
      </div>
      <Separator />
      <Table />
    </>
  );
}
