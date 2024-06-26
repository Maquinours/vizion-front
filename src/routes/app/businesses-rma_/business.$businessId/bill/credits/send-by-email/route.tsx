import { createFileRoute, redirect } from '@tanstack/react-router';
import { queries } from '../../../../../../../utils/constants/queryKeys';
import BillType from '../../../../../../../utils/enums/BillType';
import { pdf } from '@react-pdf/renderer';
import AppViewBusinessViewBillViewCreditsModalViewPdfComponent from '../../../../../../../views/App/views/Business/views/Bill/views/CreditsModal/components/Pdf/Pdf';

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/bill/credits/send-by-email')({
  loaderDeps: ({ search: { page } }) => ({ page }),
  loader: async ({ context: { queryClient }, params: { businessId }, deps: { page } }) => {
    const businessPromise = queryClient.ensureQueryData(queries.businesses.detail._ctx.byId(businessId));
    const billsPromise = queryClient.ensureQueryData(queries['business-bills'].list._ctx.byBusinessId(businessId));
    const business = await businessPromise;
    const enterprise = await queryClient.ensureQueryData(queries.enterprise.detail(business.enterpriseId));
    const credits = (await billsPromise).filter((bill) => bill.type === BillType.AVOIR);

    const credit = credits.at(page);
    if (!credit) throw redirect({ from: Route.id, to: '..', search: (old) => ({ ...old, page: 0 }), replace: true });

    const blob = await pdf(<AppViewBusinessViewBillViewCreditsModalViewPdfComponent credit={credit} business={business} enterprise={enterprise} />).toBlob();
    const file = new File([blob], `Avoir-${credit.number}.pdf`.replace(/\s|-/g, '_'), {
      type: blob.type,
    });
    return { enterprise, credit, file };
  },
});
