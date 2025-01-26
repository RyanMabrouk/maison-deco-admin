'use client';
import { useQuery } from '@tanstack/react-query';
import { highlightsQuery, HighlightsQueryArgs } from './highlightsQuery';

export default function useHighlights(args: HighlightsQueryArgs) {
  const query = useQuery(highlightsQuery(args));
  return query;
}
