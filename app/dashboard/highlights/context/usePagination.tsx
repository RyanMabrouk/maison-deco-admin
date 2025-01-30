'use client';
import { HighlightsQueryArgs } from '@/hooks/data/highlights/getHighlights/highlightsQuery';
import { createContext, useContext, useState, ReactNode } from 'react';

interface PaginationContextProps {
  filter: HighlightsQueryArgs;
  setFilter: React.Dispatch<React.SetStateAction<HighlightsQueryArgs>>;
}
const PaginationContext = createContext<PaginationContextProps | undefined>(
  undefined
);
export const PaginationProvider = ({ children }: { children: ReactNode }) => {
  const [filter, setFilter] = useState<HighlightsQueryArgs>({
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
