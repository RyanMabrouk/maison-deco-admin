import { getUserById } from './getUserById';

const userByIdQuery = (id: string) => ({
  queryKey: ['users', id],
  queryFn: async () => {
    return await getUserById(id);
  }
});
export { userByIdQuery };
