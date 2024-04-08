import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { getLifesheetPageByProductId } from '../../../../utils/api/lifesheet';
import { getTasksPageByProductId } from '../../../../utils/api/task';
import { geds } from '../../../../utils/constants/queryKeys/ged';
import { lifesheetQueryKeys } from '../../../../utils/constants/queryKeys/lifesheet';
import { taskQueryKeys } from '../../../../utils/constants/queryKeys/task';
import { users } from '../../../../utils/constants/queryKeys/user';
import FileType from '../../../../utils/enums/FileType';
import { LifesheetAssociatedItem } from '../../../../utils/enums/LifesheetAssociatedItem';
import { WorkloadAssociatedItem } from '../../../../utils/enums/WorkloadAssociatedItem';

const searchSchema = z.object({
  lifesheetPage: z.number().min(0).catch(0),
});

export const Route = createFileRoute('/app/products/$productId/informations')({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { lifesheetPage } }) => ({
    lifesheetPage,
    lifesheetSize: 5,
    workloadsPage: 0,
    workloadsSize: 100,
  }),
  loader: async ({ context: { queryClient }, params: { productId }, deps: { lifesheetPage, lifesheetSize, workloadsPage, workloadsSize } }) => {
    const user = await queryClient.ensureQueryData(users.authentified());
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')) {
      queryClient.prefetchQuery(geds.detail._ctx.byTypeAndId(FileType.PRODUIT, productId));

      queryClient.ensureQueryData({
        queryKey: lifesheetQueryKeys.pageByAssociatedItemAndId(LifesheetAssociatedItem.PRODUCT, productId, lifesheetPage, lifesheetSize),
        queryFn: () => getLifesheetPageByProductId(productId, lifesheetPage, lifesheetSize),
      });

      queryClient.ensureQueryData({
        queryKey: taskQueryKeys.pageByAssociatedItemAndId(WorkloadAssociatedItem.PRODUCT, productId, workloadsPage, workloadsSize),
        queryFn: () => getTasksPageByProductId(productId, workloadsPage, workloadsSize),
      });
    }
  },
});
