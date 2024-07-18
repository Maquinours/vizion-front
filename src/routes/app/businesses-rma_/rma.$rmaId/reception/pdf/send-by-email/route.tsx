import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../../../utils/constants/queryKeys';
import { pdf } from '@react-pdf/renderer';
import AppViewRmaViewReceptionViewPdfModalViewPdfComponent from '../../../../../../../views/App/views/Rma/views/Reception/views/PdfModal/components/Pdf/Pdf';
import LoaderModal from '../../../../../../../components/LoaderModal/LoaderModal';
import { formatFileName } from '../../../../../../../utils/functions/files';

export const Route = createFileRoute('/app/businesses-rma/rma/$rmaId/reception/pdf/send-by-email')({
  loader: async ({ context: { queryClient }, params: { rmaId } }) => {
    const rma = await queryClient.ensureQueryData(queries.rmas.detail(rmaId));
    const blob = await pdf(<AppViewRmaViewReceptionViewPdfModalViewPdfComponent rma={rma} />).toBlob();
    const file = new File([blob], formatFileName(`RMA_${rma.number}.pdf`), {
      type: blob.type,
    });

    return { rma, file };
  },
  pendingComponent: LoaderModal,
});
