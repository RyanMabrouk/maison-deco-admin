import { getCurrentUser } from './getCurrentUser';

const currentUserQuery = () => ({
  queryKey: ['users', 'me'],
  queryFn: async () => {
    return await getCurrentUser();
  }
});

export { currentUserQuery };
