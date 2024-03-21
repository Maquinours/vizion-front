export const predefinedTextQueryKeys = {
  all: ['predefined-text'] as const,
  lists: () => [...predefinedTextQueryKeys.all, 'list'] as const,
  listAll: () => [...predefinedTextQueryKeys.lists(), 'all'] as const,
};
