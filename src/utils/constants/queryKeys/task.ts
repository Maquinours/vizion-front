import { createQueryKeys } from '@lukemorales/query-key-factory';
import TaskState from '../../enums/TaskState';
import { WorkloadAssociatedItem } from '../../enums/WorkloadAssociatedItem';
import WorkloadType from '../../enums/WorkloadType';
import {
  getPaginatedTasksByStateAndProfileId,
  getTaskById,
  getTasksByType,
  getTasksPageByBusinessId,
  getTasksPageByEnterpriseId,
  getTasksPageByProductId,
  getTasksPageByRmaId,
  getUnreadTasksCountByProfileId,
  getTasksCounts,
} from '../../api/task';

export const tasks = createQueryKeys('tasks', {
  detail: (id: string) => ({
    queryKey: [id],
    queryFn: () => getTaskById(id),
  }),
  list: {
    queryKey: null,
    contextQueries: {
      byType: (type: WorkloadType) => ({
        queryKey: [type],
        queryFn: () => getTasksByType(type),
      }),
    },
  },
  page: {
    queryKey: null,
    contextQueries: {
      byStateAndProfileId: (state: TaskState, profileId: string, { page, size }: { page: number; size: number }) => ({
        queryKey: [state, profileId, page, size],
        queryFn: () => getPaginatedTasksByStateAndProfileId(state, profileId, page, size),
      }),
      byAssociatedItem: (
        { associatedItemType, associatedItemId }: { associatedItemType: WorkloadAssociatedItem; associatedItemId: string },
        { page, size }: { page: number; size: number },
      ) => ({
        queryKey: [associatedItemType, associatedItemId, page, size],
        queryFn: () => {
          switch (associatedItemType) {
            case WorkloadAssociatedItem.ENTERPRISE:
              return getTasksPageByEnterpriseId(associatedItemId, page, size);
            case WorkloadAssociatedItem.PRODUCT:
              return getTasksPageByProductId(associatedItemId, page, size);
            case WorkloadAssociatedItem.BUSINESS:
              return getTasksPageByBusinessId(associatedItemId, { page, size });
            case WorkloadAssociatedItem.RMA:
              return getTasksPageByRmaId(associatedItemId, { page, size });
          }
        },
      }),
    },
  },
  numbers: {
    queryKey: null,
    contextQueries: {
      unreadsByProfileId: (profileId: string) => ({
        queryKey: [profileId],
        queryFn: () => getUnreadTasksCountByProfileId(profileId),
      }),
    },
  },
  counts: {
    queryKey: null,
    contextQueries: {
      byProfileId: (profileId: string) => ({
        queryKey: [profileId],
        queryFn: () => getTasksCounts(profileId),
      }),
    },
  },
});
