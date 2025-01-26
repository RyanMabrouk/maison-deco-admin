'use client';
import { UsersQueryArgs } from '@/hooks/data/users/getUsers/usersQuery';
import { createContext, useContext, useState, ReactNode } from 'react';

interface PaginationContextProps {
  filter: UsersQueryArgs;
  setFilter: (filter: UsersQueryArgs) => void;
}
const PaginationContext = createContext<PaginationContextProps | undefined>(
  undefined
);
export const PaginationProvider = ({ children }: { children: ReactNode }) => {
  const [filter, setFilter] = useState<UsersQueryArgs>({
    pagination: {
      page: 1,
      limit: 8
    }
  });
  return (
    <PaginationContext.Provider value={{ filter, setFilter }}>
      {children}
    </PaginationContext.Provider>
  );
};
export const usePagination = () => {
  const context = useContext(PaginationContext);
  if (context === undefined) {
    throw new Error('usePagination must be used within a PaginationProvider');
  }
  return context;
};
