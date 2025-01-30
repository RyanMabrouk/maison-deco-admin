'use client';
import { ProductsQueryArgs } from '@/hooks/data/products/getProducts/productsQuery';
import { createContext, useContext, useState, ReactNode } from 'react';

interface PaginationContextProps {
  filter: ProductsQueryArgs;
  setFilter: React.Dispatch<React.SetStateAction<ProductsQueryArgs>>;
}
const PaginationContext = createContext<PaginationContextProps | undefined>(
  undefined
);
export const PaginationProvider = ({ children }: { children: ReactNode }) => {
  const [filter, setFilter] = useState<ProductsQueryArgs>({
    pagination: {
      page: 1,
      limit: 8
    },
    ilike: {
      slug: ''
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
