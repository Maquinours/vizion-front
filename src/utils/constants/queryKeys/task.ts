import TaskState from '../../enums/TaskState';
import WorkloadType from '../../enums/WorkloadType';

export const taskQueryKeys = {
  all: ['tasks'] as const,
  details: () => [...taskQueryKeys.all, 'details'] as const,
  detailById: (id: string) => [...taskQueryKeys.details(), { id }] as const,
  lists: () => [...taskQueryKeys.all, 'list'] as const,
  listByType: (type: WorkloadType) => [...taskQueryKeys.lists(), { type }] as const,
  listByIds: (ids: string[]) => [...taskQueryKeys.lists(), { ids }] as const,
  pages: () => [...taskQueryKeys.all, 'pages'] as const,
  pageByStateAndProfileId: (state: TaskState, profileId: string, page: number, size: number) =>
    [...taskQueryKeys.pages(), { state, profileId, page, size }] as const,
};
