'use client';
import { useQuery } from '@tanstack/react-query';
import { usersQuery, UsersQueryArgs } from './usersQuery';

export default function useUsers(args: UsersQueryArgs) {
  const query = useQuery(usersQuery(args));
  return query;
}
