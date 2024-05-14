import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../../utils/constants/queryKeys';
import BusinessQuotationResponseDto from '../../../../../../utils/types/BusinessQuotationResponseDto';

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/quotation/create-detail/$subquotationId')({
  loader: async ({ context: { queryClient }, params: { businessId, subquotationId } }) => {
    await queryClient.ensureQueryData({
      ...queries['business-sub-quotations'].detail._ctx.byId(subquotationId),
      initialData: () =>
        queryClient
          .getQueryData<BusinessQuotationResponseDto>(queries['business-quotations'].detail._ctx.byBusinessId(businessId).queryKey)
          ?.subQuotationList?.find((sub) => sub.id === subquotationId),
      initialDataUpdatedAt: () => queryClient.getQueryState(queries['business-quotations'].detail._ctx.byBusinessId(businessId).queryKey)?.dataUpdatedAt,
    });
  },
});
