import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../../utils/constants/queryKeys';
import BusinessArcResponseDto from '../../../../../../utils/types/BusinessArcResponseDto';

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/arc/update-detail/$detailId')({
  loader: async ({ context: { queryClient }, params: { businessId, detailId } }) => {
    await queryClient.ensureQueryData({
      ...queries['business-arc-details'].detail._ctx.byId(detailId),
      initialData: () =>
        queryClient
          .getQueryData<BusinessArcResponseDto>(queries['business-ARCs'].detail._ctx.byBusinessId(businessId).queryKey)
          ?.arcDetailsList?.find((detail) => detail.id === detailId),
      initialDataUpdatedAt: queryClient.getQueryState(queries['business-ARCs'].detail._ctx.byBusinessId(businessId).queryKey)?.dataUpdatedAt,
    });
  },
});
