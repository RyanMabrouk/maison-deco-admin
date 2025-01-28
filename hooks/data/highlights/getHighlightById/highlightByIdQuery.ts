import { getHighlightById } from './gethighlightById';

const highlightByIdQuery = (slug: string) => ({
  queryKey: ['highlights', slug],
  queryFn: async () => {
    const res = await getHighlightById(slug);
    return {
      ...res,
      data: {
        ...res.data,
        highlight_products: res.data?.highlight_products.map(
          (highlight_product) => ({
            ...highlight_product.products
          })
        )
      }
    };
  }
});
export { highlightByIdQuery };
