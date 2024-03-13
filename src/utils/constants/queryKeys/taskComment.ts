export const taskCommentsQueryKeys = {
  all: ['task-comments'] as const,
  lists: () => [...taskCommentsQueryKeys.all, 'list'] as const,
  listByTaskId: (taskId: string) => [...taskCommentsQueryKeys.lists(), { taskId }] as const,
};
