export const predefinedMessageQueryKeys = {
  all: ['predefined-messages'] as const,
  lists: () => [...predefinedMessageQueryKeys.all, 'list'] as const,
  listAll: () => [...predefinedMessageQueryKeys.lists(), 'all'] as const,
};
