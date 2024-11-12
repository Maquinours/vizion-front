import { createFileRoute, redirect } from '@tanstack/react-router';
import { queries } from '../../../../../../utils/constants/queryKeys';
import BusinessResponseDto from '../../../../../../utils/types/BusinessResponseDto';
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/businesses-rma_/business/$businessId/dashboard/confirm-quotation-import/$otherBusinessId')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(queries.user.authentified());
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')) throw redirect({ from: Route.fullPath, to: '../..', search: true });
  },
  loader: async ({ context: { queryClient }, params: { otherBusinessId } }) => {
    await queryClient.ensureQueryData({
      ...queries.businesses.detail._ctx.byId(otherBusinessId),
      initialData: () =>
        queryClient.getQueryData<Array<BusinessResponseDto>>(queries.businesses.list._ctx.all.queryKey)?.find((business) => business.id === otherBusinessId),
      initialDataUpdatedAt: () => queryClient.getQueryState(queries.businesses.list._ctx.all.queryKey)?.dataUpdatedAt,
    });
  },
  pendingComponent: LoaderModal,
});
