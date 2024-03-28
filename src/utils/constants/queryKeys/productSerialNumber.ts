export const productSerialNumberQueryKeys = {
  all: ['product-serial-numbers'] as const,
  pages: () => [...productSerialNumberQueryKeys.all, 'page'] as const,
  pageWithSearch: (search: string | undefined, page: number, size: number) => [...productSerialNumberQueryKeys.pages(), { search, page, size }] as const,
  details: () => [...productSerialNumberQueryKeys.all, 'detail'] as const,
  detailById: (id: string) => [...productSerialNumberQueryKeys.details(), { id }] as const,
};
