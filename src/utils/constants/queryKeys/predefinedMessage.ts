export const predefinedMessageQueryKeys = {
  all: ['predefined-messages'] as const,
  lists: () => [...predefinedMessageQueryKeys.all, 'list'] as const,
  listAll: () => [...predefinedMessageQueryKeys.lists(), 'all'] as const,
  pages: () => [...predefinedMessageQueryKeys.all, 'page'] as const,
  page: (page: number, size: number) => [...predefinedMessageQueryKeys.pages(), { page, size }] as const,
  details: () => [...predefinedMessageQueryKeys.all, 'detail'] as const,
  detailById: (id: string) => [...predefinedMessageQueryKeys.details(), { id }] as const,
};
