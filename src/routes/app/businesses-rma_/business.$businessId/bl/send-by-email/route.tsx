import { createFileRoute, redirect } from '@tanstack/react-router';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { pdf } from '@react-pdf/renderer';
import AppViewBusinessViewBlViewBodyComponentPdfComponent from '../../../../../../views/App/views/Business/views/Bl/components/Body/components/Pdf/Pdf';
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal';
import { formatFileName } from '../../../../../../utils/functions/files';

export const Route = createFileRoute('/app/businesses-rma_/business/$businessId/bl/send-by-email')({
  loaderDeps: ({ search: { page } }) => ({ page }),
  loader: async ({ context: { queryClient }, params: { businessId }, deps: { page } }) => {
    const businessPromise = queryClient.ensureQueryData(queries.businesses.detail._ctx.byId(businessId));
    const bls = await queryClient.ensureQueryData(queries['business-bls'].list._ctx.byBusinessId(businessId));
    const bl = bls.at(page);
    if (!bl)
      throw redirect({
        from: Route.fullPath,
        to: '..',
        search: (old) => ({ ...old, page: 0 }),
        replace: true,
      });
    const business = await businessPromise;
    const blob = await pdf(<AppViewBusinessViewBlViewBodyComponentPdfComponent business={business} bl={bl} />).toBlob();
    const file = new File([blob], formatFileName(`${bl.number}.pdf`), {
      type: blob.type,
    });

    queryClient.prefetchQuery(queries['predefined-message'].list);

    return { business, bl, file };
  },
  pendingComponent: LoaderModal,
});
