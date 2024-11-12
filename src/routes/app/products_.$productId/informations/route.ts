import { SearchSchemaInput, createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { queries } from '../../../../utils/constants/queryKeys';
import { geds } from '../../../../utils/constants/queryKeys/ged';
import { lifesheets } from '../../../../utils/constants/queryKeys/lifesheet';
import { users } from '../../../../utils/constants/queryKeys/user';
import FileType from '../../../../utils/enums/FileType';
import { LifesheetAssociatedItem } from '../../../../utils/enums/LifesheetAssociatedItem';
import { WorkloadAssociatedItem } from '../../../../utils/enums/WorkloadAssociatedItem';

const searchSchema = z.object({
  lifesheetPage: z.number().min(0).catch(0),
});

export const Route = createFileRoute('/app/products_/$productId/informations')({
  validateSearch: (data: { lifesheetPage?: number } & SearchSchemaInput) => searchSchema.parse(data),
  loaderDeps: ({ search: { lifesheetPage } }) => ({
    lifesheetPage,
    lifesheetSize: 5,
    workloadsPage: 0,
    workloadsSize: 100,
  }),
  loader: ({ context: { queryClient }, params: { productId }, deps: { lifesheetPage, lifesheetSize, workloadsPage, workloadsSize } }) => {
    queryClient.ensureQueryData(users.authentified()).then((user) => {
      if (user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')) {
        queryClient.prefetchQuery(geds.detail._ctx.byTypeAndId(FileType.PRODUIT, productId));

        queryClient.prefetchQuery(
          lifesheets.page({ page: lifesheetPage, size: lifesheetSize })._ctx.byAssociatedItem({
            associatedItemType: LifesheetAssociatedItem.PRODUCT,
            associatedItemId: productId,
          }),
        );

        queryClient.prefetchQuery(
          queries.tasks.page._ctx.byAssociatedItem(
            {
              associatedItemType: WorkloadAssociatedItem.PRODUCT,
              associatedItemId: productId,
            },
            { page: workloadsPage, size: workloadsSize },
          ),
        );
      }
    });
  },
});
