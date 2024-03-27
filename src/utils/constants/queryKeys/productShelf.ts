export const productShelfQueryKeys = {
  all: ['product-shelves'] as const,
  lists: () => [...productShelfQueryKeys.all, 'list'] as const,
  listAll: () => [...productShelfQueryKeys.lists(), 'all'] as const,
};
