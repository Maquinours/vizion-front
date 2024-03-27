export const productSaleQueryKeys = {
  all: ['product-sales'] as const,
  details: () => [...productSaleQueryKeys.all, 'detail'] as const,
  detailByProductIdAndSearch: (
    productId: string,
    contact: string | undefined,
    startDate: Date | undefined,
    endDate: Date | undefined,
    page: number,
    size: number,
  ) => [...productSaleQueryKeys.details(), { productId, contact, startDate, endDate, page, size }] as const,
};
