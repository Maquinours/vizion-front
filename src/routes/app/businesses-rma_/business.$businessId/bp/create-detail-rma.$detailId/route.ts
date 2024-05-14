import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../../utils/constants/queryKeys';
import BusinessBpResponseDto from '../../../../../../utils/types/BusinessBpResponseDto';

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/bp/create-detail-rma/$detailId')({
  loader: async ({ context: { queryClient }, params: { businessId, detailId } }) => {
    await queryClient.ensureQueryData({
      ...queries['business-bp-details'].detail._ctx.byId(detailId),
      initialData: () =>
        queryClient
          .getQueryData<BusinessBpResponseDto>(queries['business-bps'].detail._ctx.byBusinessId(businessId).queryKey)
          ?.bpDetailsList?.find((detail) => detail.id === detailId),
      initialDataUpdatedAt: queryClient.getQueryState(queries['business-bps'].detail._ctx.byBusinessId(businessId).queryKey)?.dataUpdatedAt,
    });
  },
});
