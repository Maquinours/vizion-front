export const productVersionShelfStockEntryQueryKeys = {
  all: ['product-version-shelf-stock-entries'] as const,
  pages: () => [...productVersionShelfStockEntryQueryKeys.all, 'page'] as const,
  pageByVersionShelfStockId: (versionShelfStockId: string, page: number, size: number) =>
    [...productVersionShelfStockEntryQueryKeys.pages(), { versionShelfStockId, page, size }] as const,
};
