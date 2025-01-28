'use client';
import { useQuery } from '@tanstack/react-query';
import { highlightByIdQuery } from './highlightByIdQuery';
export default function useHighlightById(slug: string) {
  const query = useQuery(highlightByIdQuery(slug));
  return query;
}
