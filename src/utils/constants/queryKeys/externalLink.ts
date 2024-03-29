export const externalLinkQueryKeys = {
  all: ['external-link'] as const,
  pages: () => [...externalLinkQueryKeys.all, 'page'] as const,
  pageByArchiveState: (archived: boolean, page: number, size: number) => [...externalLinkQueryKeys.pages(), { archived, page, size }] as const,
  details: () => [...externalLinkQueryKeys.all, 'detail'] as const,
  detailById: (id: string) => [...externalLinkQueryKeys.details(), { id }] as const,
};
