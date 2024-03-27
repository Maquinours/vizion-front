export const productQueryKeys = {
  all: ['product'] as const,
  details: () => [...productQueryKeys.all, 'details'] as const,
  detailById: (id: string) => [...productQueryKeys.details(), id] as const,
  lists: () => [...productQueryKeys.all, 'list'] as const,
  listAll: () => [...productQueryKeys.lists(), 'all'] as const,
  listNotAssociatedProducts: (productId: string) => [...productQueryKeys.lists(), 'not-associated', productId] as const,
  pages: () => [...productQueryKeys.all, 'page'] as const,
  pageWithSearch: (ref: string | undefined, designation: string | undefined, page: number, size: number) =>
    [...productQueryKeys.pages(), { ref, designation, page, size }] as const,
  pageByAssociatedProduct: (associatedProductId: string, page: number, size: number) =>
    [...productQueryKeys.pages(), { associatedProductId, page, size }] as const,
};
