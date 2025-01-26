import { infinityPagination } from '@/helpers/infinityPagination';
import { GenericOps } from '@/types';
import { getUsers } from './getUsers';
import { Tables } from '@/types/database.types';

export interface UsersQueryArgs extends GenericOps<'users'> {
  ilike?: Partial<{ [k in keyof Tables<'users'>]: string }>;
}

const usersQuery = (args: UsersQueryArgs) => ({
  queryKey: ['users', args],
  queryFn: async () => {
    const { page, limit } = args.pagination;

    const res = await getUsers(args);

    return infinityPagination(res.data ?? [], {
      page,
      limit,
      total_count: res.count ?? 0
    });
  }
});
export { usersQuery };
