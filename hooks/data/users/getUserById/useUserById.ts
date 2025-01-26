'use client';
import { useQuery } from '@tanstack/react-query';
import { userByIdQuery } from './userByIdQuery';

export default function useUserById(userId: string) {
  const query = useQuery(userByIdQuery(userId)); // Specify IBookPopulated here
  return query;
}
