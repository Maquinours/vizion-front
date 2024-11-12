import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../../utils/constants/queryKeys';
import BusinessQuotationResponseDto from '../../../../../../utils/types/BusinessQuotationResponseDto';
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/businesses-rma_/business/$businessId/quotation/update-detail/$detailId')({
  loader: async ({ context: { queryClient }, params: { businessId, detailId } }) => {
    await queryClient.ensureQueryData({
      ...queries['business-quotation-details'].detail._ctx.byId(detailId),
      initialData: () =>
        queryClient
          .getQueryData<BusinessQuotationResponseDto>(queries['business-quotations'].detail._ctx.byBusinessId(businessId).queryKey)
          ?.subQuotationList?.flatMap((sub) => sub.quotationDetails ?? [])
          ?.find((detail) => detail.id === detailId),
      initialDataUpdatedAt: () => queryClient.getQueryState(queries['business-quotations'].detail._ctx.byBusinessId(businessId).queryKey)?.dataUpdatedAt,
    });
  },
  pendingComponent: LoaderModal,
});
