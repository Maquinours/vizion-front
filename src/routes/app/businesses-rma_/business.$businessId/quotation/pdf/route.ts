import { createFileRoute } from '@tanstack/react-router';
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal';
import { queries } from '../../../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/quotation/pdf')({
  loader: async ({ context: { queryClient }, params: { businessId } }) => {
    const quotation = await queryClient.ensureQueryData(queries['business-quotations'].detail._ctx.byBusinessId(businessId));
    const references = (quotation.subQuotationList
      ?.flatMap((subQuotation) => subQuotation.quotationDetails?.map((detail) => detail.productReference))
      ?.filter((reference) => reference !== null) ?? []) as string[];
    await queryClient.ensureQueryData({
      ...queries['commercial-notices'].data._ctx.byProductReferences(references),
      staleTime: Infinity,
    });
  },
  pendingComponent: LoaderModal,
});
