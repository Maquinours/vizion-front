export const emailQueryKeys = {
  all: ['emails'] as const,
  details: () => [...emailQueryKeys.all, 'detail'] as const,
  detailById: (id: string) => [...emailQueryKeys.details(), { id }] as const,
  pages: () => [...emailQueryKeys.all, 'page'] as const,
  pageBySpamStateWithSearch: (spamState: boolean, page: number, size: number, search: string | undefined) =>
    [...emailQueryKeys.pages(), { spamState, page, size, search }] as const,
};
