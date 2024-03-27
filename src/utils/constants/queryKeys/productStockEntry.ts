export const productStockEntryQueryKeys = {
  all: ['product-stock-entries'] as const,
  pages: () => [...productStockEntryQueryKeys.all, 'pages'] as const,
  pageByProductId: (productId: string, page: number, size: number) => [...productStockEntryQueryKeys.pages(), { productId, page, size }] as const,
};
