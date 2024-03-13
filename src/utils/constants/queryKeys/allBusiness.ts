export const allBusinessQueryKeys = {
  all: ['all-business'] as const,
  lists: () => [...allBusinessQueryKeys.all, 'list'] as const,
  listAll: () => [...allBusinessQueryKeys.lists(), 'all'] as const,
};
