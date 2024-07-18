import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../../../utils/constants/queryKeys';
import { pdf } from '@react-pdf/renderer';
import AppViewAssistanceViewPdfModalViewPdfComponent from '../../../../../../views/App/views/Assistance/views/PdfModal/components/Pdf/Pdf';
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal';
import { formatFileName } from '../../../../../../utils/functions/files';

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/assistance/$assistanceId/pdf/send-by-email')({
  loader: async ({ context: { queryClient }, params: { assistanceId } }) => {
    const assistance = await queryClient.ensureQueryData(queries['technical-supports'].detail._ctx.byId(assistanceId));
    const blob = await pdf(<AppViewAssistanceViewPdfModalViewPdfComponent assistance={assistance} />).toBlob();
    const file = new File([blob], formatFileName(`Assistance ${assistance.businessNumber}.pdf`), {
      type: blob.type,
    });

    return { file, assistance };
  },
  pendingComponent: LoaderModal,
});
