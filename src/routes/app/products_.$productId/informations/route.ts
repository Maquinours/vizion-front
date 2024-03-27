import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { getAuthentifiedUser } from '../../../../views/App/utils/api/authentifiedUser';
import { lifesheetQueryKeys } from '../../../../utils/constants/queryKeys/lifesheet';
import { LifesheetAssociatedItem } from '../../../../utils/enums/LifesheetAssociatedItem';
import { getLifesheetPageByProductId } from '../../../../utils/api/lifesheet';
import { gedQueryKeys } from '../../../../utils/constants/queryKeys/ged';
import FileType from '../../../../utils/enums/FileType';
import { getDirectoryByTypeAndIdOnS3 } from '../../../../utils/api/ged';
import { taskQueryKeys } from '../../../../utils/constants/queryKeys/task';
import { WorkloadAssociatedItem } from '../../../../utils/enums/WorkloadAssociatedItem';
import { getTasksPageByProductId } from '../../../../utils/api/task';

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
    const user = await queryClient.ensureQueryData({ queryKey: ['authentified-user'], queryFn: getAuthentifiedUser });
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')) {
      queryClient.ensureQueryData({
        queryKey: gedQueryKeys.detailByTypeAndId(FileType.PRODUIT, productId),
        queryFn: () => getDirectoryByTypeAndIdOnS3(FileType.PRODUIT, productId),
      });

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
