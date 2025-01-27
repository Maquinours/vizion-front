import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../../../utils/constants/queryKeys';
import AppViewBusinessViewQuotationViewPdfModalViewPdfComponent from '../../../../../../../views/App/views/Business/views/Quotation/views/PdfModal/components/Pdf/Pdf';
import { pdf } from '@react-pdf/renderer';
import LoaderModal from '../../../../../../../components/LoaderModal/LoaderModal';
import { formatFileName } from '../../../../../../../utils/functions/files';

export const Route = createFileRoute('/app/businesses-rma_/business/$businessId/quotation/pdf/send-by-email')({
  loaderDeps: ({ search: { hideAddresses, hideReferences, hidePrices, hideTotal } }) => ({ hideAddresses, hideReferences, hidePrices, hideTotal }),
  loader: async ({ context: { queryClient }, params: { businessId }, deps: { hideAddresses, hideReferences, hidePrices, hideTotal } }) => {
    const quotationPromise = queryClient.ensureQueryData(queries['business-quotations'].detail._ctx.byBusinessId(businessId));
    const businessPromise = queryClient.ensureQueryData(queries.businesses.detail._ctx.byId(businessId));

    const quotation = await quotationPromise;
    const commercialNoticeData = await queryClient.ensureQueryData(
      queries['commercial-notices'].data._ctx.byProductReferences(
        (quotation.subQuotationList
          ?.flatMap((subQuotation) => subQuotation.quotationDetails?.map((detail) => detail.productReference))
          ?.filter((reference) => reference !== null) ?? []) as string[],
      ),
    );
    const commercialNoticeBlob = await (await fetch(`data:application/pdf;base64,${commercialNoticeData}`)).blob();
    const commercialNoticeFile = new File([commercialNoticeBlob], 'DOC_COMMERCIAL_VIZEO.pdf', { type: commercialNoticeBlob.type });

    const business = await businessPromise;
    const department = await (business.deliveryDepartmentCode
      ? queryClient.ensureQueryData(queries.departments.detail._ctx.byCode(business.deliveryDepartmentCode))
      : Promise.resolve(undefined));
    const representative = await (department?.repEnterprise
      ? queryClient.ensureQueryData(queries.enterprise.detail(department.repEnterprise.id))
      : Promise.resolve(undefined));
    const quotationPdfBlob = await pdf(
      <AppViewBusinessViewQuotationViewPdfModalViewPdfComponent
        business={business}
        quotation={quotation}
        hideAddresses={hideAddresses}
        hideReferences={hideReferences}
        hidePrices={hidePrices}
        hideTotal={hideTotal}
      />,
    ).toBlob();
    const quotationPdfFile = new File([quotationPdfBlob], formatFileName(`Devis-${quotation.number}.pdf`), {
      type: quotationPdfBlob.type,
    });

    queryClient.prefetchQuery(queries['predefined-message'].list);

    return {
      business,
      quotation,
      representative,
      commercialNoticeFile,
      quotationPdfFile,
    };
  },
  pendingComponent: LoaderModal,
});
