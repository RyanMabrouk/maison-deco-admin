'use client';
import { useQuery } from '@tanstack/react-query';
import { highlightByIdQuery } from './highlightByIdQuery';
export default function useHighlightById(id: string) {
  const query = useQuery(highlightByIdQuery(id));
  return query;
}
