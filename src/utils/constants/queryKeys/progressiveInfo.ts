export const progressiveInfoQueryKeys = {
  all: ['progressive-infos'] as const,
  lists: () => [...progressiveInfoQueryKeys.all, 'lists'] as const,
  listAll: () => [...progressiveInfoQueryKeys.lists(), 'all'] as const,
  details: () => [...progressiveInfoQueryKeys.all, 'details'] as const,
  detailById: (id: string) => [...progressiveInfoQueryKeys.details(), { id }] as const,
};
