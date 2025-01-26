import { GenericOps } from '@/types';
import { getHighlights } from './getHighlights';

export interface HighlightsQueryArgs
  extends Omit<GenericOps<'highlights'>, 'pagination'> {}

const highlightsQuery = (args: HighlightsQueryArgs) => ({
  queryKey: ['highlights', args],
  queryFn: async () => {
    const res = await getHighlights(args);
    return res;
  }
});
export { highlightsQuery };
