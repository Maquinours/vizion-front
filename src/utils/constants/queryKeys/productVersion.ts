export const productVersionQueryKeys = {
  all: ['product-versions'] as const,
  lists: () => [...productVersionQueryKeys.all, 'list'] as const,
  listByProductId: (productId: string) => [...productVersionQueryKeys.lists(), { productId }] as const,
  pages: () => [...productVersionQueryKeys.all, 'page'] as const,
  pageByProductId: (productId: string, page: number, size: number) => [...productVersionQueryKeys.pages(), { productId, page, size }] as const,
  details: () => [...productVersionQueryKeys.all, 'detail'] as const,
  detailById: (id: string) => [...productVersionQueryKeys.details(), { id }] as const,
};
