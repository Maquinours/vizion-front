import { createFileRoute, notFound, SearchSchemaInput } from '@tanstack/react-router';
import z from 'zod';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';
import { queries } from '../../../../utils/constants/queryKeys';

const searchSchema = z.object({
  defaultBusinessRmaId: z.uuid().optional().catch(undefined),
});

export const Route = createFileRoute('/app/enterprises_/$enterpriseId/relate-business-rma')({
  validateSearch: (
    data: {
      defaultBusinessRmaId?: string
    } & SearchSchemaInput,
  ) => searchSchema.parse(data),
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(queries.user.authentified());
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')) throw notFound();
  },
  loader: ({ context: { queryClient }, params: { enterpriseId } }) => {
    queryClient.prefetchQuery(queries['all-businesses'].partial._ctx.list._ctx.notAssociatedByEnterpriseId(enterpriseId));
  },
  pendingComponent: LoaderModal,
});
