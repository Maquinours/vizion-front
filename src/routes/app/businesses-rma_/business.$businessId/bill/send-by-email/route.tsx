import { createFileRoute, redirect } from '@tanstack/react-router';
import { queries } from '../../../../../../utils/constants/queryKeys';
import BillType from '../../../../../../utils/enums/BillType';
import { pdf } from '@react-pdf/renderer';
import AppViewBusinessViewBillViewPdfComponent from '../../../../../../views/App/views/Business/views/Bill/components/Pdf/Pdf';
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal';
import { formatFileName } from '../../../../../../utils/functions/files';

export const Route = createFileRoute('/app/businesses-rma_/business/$businessId/bill/send-by-email')({
  loader: async ({ context: { queryClient }, params: { businessId } }) => {
    const user = await queryClient.ensureQueryData(queries.user.authentified());
    const businessPromise = queryClient.ensureQueryData(queries.businesses.detail._ctx.byId(businessId));
    const billsPromise = queryClient.ensureQueryData(queries['business-bills'].list._ctx.byBusinessId(businessId));
    const business = await businessPromise;
    const enterprisePromise = queryClient.ensureQueryData(queries.enterprise.detail(business.enterpriseId));

    const bill = (await billsPromise).find((bill) => bill.type === BillType.FACTURE);

    if (!bill) throw redirect({ from: Route.fullPath, to: '..', replace: true });

    const enterprise = await enterprisePromise;
    const showAmounts =
      user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') || (!!user.profile.enterprise && user.profile.enterprise.id === business.enterpriseId);

    const blob = await pdf(
      <AppViewBusinessViewBillViewPdfComponent bill={bill} business={business} enterprise={enterprise} showAmounts={showAmounts} />,
    ).toBlob();
    const file = new File([blob], formatFileName(`${bill.number}.pdf`), {
      type: blob.type,
    });

    queryClient.prefetchQuery(queries['predefined-message'].list);

    return { business, bill, file, enterprise };
  },
  pendingComponent: LoaderModal,
});
