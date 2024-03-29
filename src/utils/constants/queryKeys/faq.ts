export const faqQueryKeys = {
  all: ['faq'] as const,
  pages: () => [...faqQueryKeys.all, 'page'] as const,
  pageByArchiveStateAndSearch: (archived: boolean, searchText: string | undefined, page: number, size: number) =>
    [...faqQueryKeys.pages(), { archived, searchText, page, size }] as const,
  details: () => [...faqQueryKeys.all, 'detail'] as const,
  detailById: (id: string) => [...faqQueryKeys.details(), { id }] as const,
};
