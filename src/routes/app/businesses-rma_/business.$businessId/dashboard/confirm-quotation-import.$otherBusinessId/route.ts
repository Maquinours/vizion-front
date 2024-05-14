import { createFileRoute, redirect } from '@tanstack/react-router';
import { queries } from '../../../../../../utils/constants/queryKeys';
import BusinessResponseDto from '../../../../../../utils/types/BusinessResponseDto';

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/dashboard/confirm-quotation-import/$otherBusinessId')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(queries.user.authentified());
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')) throw redirect({ from: Route.id, to: '../..', search: (old) => old });
  },
  loader: async ({ context: { queryClient }, params: { otherBusinessId } }) => {
    await queryClient.ensureQueryData({
      ...queries.businesses.detail._ctx.byId(otherBusinessId),
      initialData: () =>
        queryClient.getQueryData<Array<BusinessResponseDto>>(queries.businesses.list._ctx.all.queryKey)?.find((business) => business.id === otherBusinessId),
      initialDataUpdatedAt: () => queryClient.getQueryState(queries.businesses.list._ctx.all.queryKey)?.dataUpdatedAt,
    });
  },
});
