import { useQuery } from '@tanstack/react-query';
import { currentUserQuery } from './currentUserQuery';

export default function useCurrentUser() {
  const query = useQuery(currentUserQuery());
  return query;
}
