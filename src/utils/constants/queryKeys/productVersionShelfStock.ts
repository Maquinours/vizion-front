export const productVersionShelfStocksQueryKeys = {
  all: ['product-version-shelf-stocks'] as const,
  pages: () => [...productVersionShelfStocksQueryKeys.all, 'page'] as const,
  pageByProductId: (productId: string, page: number, size: number) => [...productVersionShelfStocksQueryKeys.pages(), { productId, page, size }] as const,
  details: () => [...productVersionShelfStocksQueryKeys.all, 'detail'] as const,
  detailById: (id: string) => [...productVersionShelfStocksQueryKeys.details(), { id }] as const,
};
