import { getHighlightById } from './gethighlightById';

const highlightByIdQuery = (id: string) => ({
  queryKey: ['highlights', id],
  queryFn: async () => {
    return await getHighlightById(id);
  }
});
export { highlightByIdQuery };
