import { SearchSchemaInput, createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { lifesheets } from '../../../../../utils/constants/queryKeys/lifesheet';
import { LifesheetAssociatedItem } from '../../../../../utils/enums/LifesheetAssociatedItem';
import { geds } from '../../../../../utils/constants/queryKeys/ged';
import FileType from '../../../../../utils/enums/FileType';
import { queries } from '../../../../../utils/constants/queryKeys';
import { WorkloadAssociatedItem } from '../../../../../utils/enums/WorkloadAssociatedItem';
import AssistanceState from '../../../../../utils/enums/AssistanceState';

const searchSchema = z.object({
  lifesheetPage: z.number().min(0).catch(0),
});

export const Route = createFileRoute('/app/businesses-rma/rma/$rmaId/support')({
  validateSearch: (data: { lifesheetPage?: number } & SearchSchemaInput) => searchSchema.parse(data),
  loaderDeps: ({ search: { lifesheetPage } }) => ({ lifesheetPage }),
  loader: async ({ context: { queryClient }, params: { rmaId }, deps: { lifesheetPage } }) => {
    const rma = await queryClient.ensureQueryData(queries.rmas.detail(rmaId));
    if (
      ![AssistanceState.PRISE_EN_CHARGE, AssistanceState.RECEPTION, AssistanceState.ANALYSE_REPARATION_EXPEDITION, AssistanceState.ARCHIVE].includes(rma.state)
    )
      throw redirect({ from: Route.id, to: '/app/businesses-rma/rma/$rmaId', search: (old) => ({ ...old, lifesheetPage: undefined }), replace: true });

    queryClient.prefetchQuery(
      lifesheets.page({ page: lifesheetPage, size: 5 })._ctx.byAssociatedItem({ associatedItemType: LifesheetAssociatedItem.RMA, associatedItemId: rmaId }),
    );
    queryClient.prefetchQuery(geds.detail._ctx.byTypeAndId(FileType.SAV, rmaId));
    const user = await queryClient.ensureQueryData(queries.user.authentified());
    if (user.userInfo.roles.some((role) => ['ROLE_MEMBRE_VIZEO', 'ROLE_REPRESENTANT'].includes(role)))
      queryClient.prefetchQuery(
        queries.tasks.page._ctx.byAssociatedItem({ associatedItemType: WorkloadAssociatedItem.RMA, associatedItemId: rmaId }, { page: 0, size: 100 }),
      );
  },
});
