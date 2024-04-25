import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../../../utils/constants/queryKeys';
import { pdf } from '@react-pdf/renderer';
import AppViewBusinessViewArcViewPdfModalViewPdfComponent from '../../../../../../../views/App/views/Business/views/Arc/views/PdfModal/components/Pdf/Pdf';

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/arc/pdf/send-by-email')({
  loaderDeps: ({ search: { hideReferencesPrices } }) => ({ hideReferencesPrices }),
  loader: async ({ context: { queryClient }, params: { businessId }, deps: { hideReferencesPrices } }) => {
    const businessPromise = queryClient.ensureQueryData(queries.businesses.detail._ctx.byId(businessId));
    const stocksPromise = queryClient.ensureQueryData(queries['product-stocks'].list._ctx.all);
    const arcPromise = queryClient.ensureQueryData(queries['business-ARCs'].detail._ctx.byBusinessId(businessId));

    const business = await businessPromise;
    const department = await queryClient.ensureQueryData(queries.departments.detail._ctx.byCode(business.deliveryDepartmentCode!));
    const representative = await queryClient.ensureQueryData(queries.enterprise.detail(department.repEnterprise!.id));
    const [stocks, arc] = await Promise.all([stocksPromise, arcPromise]);
    const blob = await pdf(
      <AppViewBusinessViewArcViewPdfModalViewPdfComponent business={business} arc={arc} stocks={stocks} hideReferencesPrices={hideReferencesPrices} />,
    ).toBlob();
    const file = new File([blob], `ARC-${arc.number}.pdf`.replace(/\s|-/g, '_'), {
      type: blob.type,
    });

    return {
      business,
      arc,
      representative,
      file,
    };
  },
});
