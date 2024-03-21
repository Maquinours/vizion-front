export const departmentQueryKeys = {
  all: ['departments'] as const,
  lists: () => [...departmentQueryKeys.all, 'lists'] as const,
  listAll: () => [...departmentQueryKeys.lists(), 'all'] as const,
};
