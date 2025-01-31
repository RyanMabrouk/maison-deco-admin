'use client';
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction
} from 'react';
import { OrdersQueryArgs } from '@/hooks/data/orders/getOrders/getQuery';
interface PaginationContextProps {
  filter: OrdersQueryArgs;
  setFilter: Dispatch<SetStateAction<OrdersQueryArgs>>;
}
const PaginationContext = createContext<PaginationContextProps | undefined>(
  undefined
);
export const PaginationProvider = ({ children }: { children: ReactNode }) => {
  const [filter, setFilter] = useState<OrdersQueryArgs>({
    pagination: {
      page: 1,
      limit: 8
    },
    order: {
      column: 'created_at',
      direction: 'desc'
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
