export const productSpecificationQueryKeys = {
  all: ['product-specifications'] as const,
  pages: () => [...productSpecificationQueryKeys.all, 'page'] as const,
  pageByProductId: (productId: string, page: number, size: number) => [...productSpecificationQueryKeys.pages(), { productId, page, size }] as const,
  details: () => [...productSpecificationQueryKeys.all, 'detail'] as const,
  detailById: (productId: string, specificationId: string) => [...productSpecificationQueryKeys.details(), { id: { productId, specificationId } }] as const,
};
