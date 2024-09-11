import { createQueryKeys } from '@lukemorales/query-key-factory';
import { LifesheetAssociatedItem } from '../../enums/LifesheetAssociatedItem';
import {
  getLifesheetById,
  getLifesheetPageByAssistanceId,
  getLifesheetPageByBusinessId,
  getLifesheetPageByEnterpriseId,
  getLifesheetPageByProductId,
  getLifesheetPageByRmaId,
} from '../../api/lifesheet';

export const lifesheets = createQueryKeys('lifesheets', {
  page: ({ page, size }: { page: number; size: number }) => ({
    queryKey: [page, size],
    contextQueries: {
      byAssociatedItem: ({ associatedItemType, associatedItemId }: { associatedItemType: LifesheetAssociatedItem; associatedItemId: string }) => ({
        queryKey: [associatedItemType, associatedItemId],
        queryFn: () => {
          switch (associatedItemType) {
            case LifesheetAssociatedItem.PRODUCT:
              return getLifesheetPageByProductId(associatedItemId, page, size);
            case LifesheetAssociatedItem.ENTERPRISE:
              return getLifesheetPageByEnterpriseId(associatedItemId, page, size);
            case LifesheetAssociatedItem.RMA:
              return getLifesheetPageByRmaId(associatedItemId, page, size);
            case LifesheetAssociatedItem.ASSISTANCE:
              return getLifesheetPageByAssistanceId(associatedItemId, page, size);
            case LifesheetAssociatedItem.BUSINESS:
              return getLifesheetPageByBusinessId(associatedItemId, page, size);
          }
        },
      }),
    },
  }),
  detail: {
    queryKey: null,
    contextQueries: {
      byId: (id: string) => ({
        queryKey: [id],
        queryFn: () => getLifesheetById(id),
      }),
    },
  },
});
