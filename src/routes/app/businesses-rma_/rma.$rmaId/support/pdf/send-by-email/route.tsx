import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../../../utils/constants/queryKeys';
import { pdf } from '@react-pdf/renderer';
import AppViewRmaViewSupportViewPdfModalViewPdfComponent from '../../../../../../../views/App/views/Rma/views/Support/views/PdfModal/components/Pdf/Pdf';
import LoaderModal from '../../../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/businesses-rma/rma/$rmaId/support/pdf/send-by-email')({
  loader: async ({ context: { queryClient }, params: { rmaId } }) => {
    const rma = await queryClient.ensureQueryData(queries.rmas.detail(rmaId));
    const blob = await pdf(<AppViewRmaViewSupportViewPdfModalViewPdfComponent rma={rma} />).toBlob();
    const file = new File([blob], `RMA_${rma.number}.pdf`.replace(/\s|-/g, '_'), {
      type: blob.type,
    });

    return { rma, file };
  },
  pendingComponent: LoaderModal,
});
