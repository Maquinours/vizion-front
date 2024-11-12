import { createFileRoute } from '@tanstack/react-router'
import { queries } from '../../../../../../../utils/constants/queryKeys'
import { pdf } from '@react-pdf/renderer'
import AppViewRmaViewDeliveryViewPdfModalViewPdfComponent from '../../../../../../../views/App/views/Rma/views/Delivery/views/PdfModal/components/Pdf/Pdf'
import LoaderModal from '../../../../../../../components/LoaderModal/LoaderModal'
import { formatFileName } from '../../../../../../../utils/functions/files'

export const Route = createFileRoute(
  '/app/businesses-rma_/rma/$rmaId/delivery/pdf/send-by-email',
)({
  loader: async ({ context: { queryClient }, params: { rmaId } }) => {
    const rma = await queryClient.ensureQueryData(queries.rmas.detail(rmaId))
    const blob = await pdf(
      <AppViewRmaViewDeliveryViewPdfModalViewPdfComponent rma={rma} />,
    ).toBlob()
    const file = new File([blob], formatFileName(`RMA_${rma.number}.pdf`), {
      type: blob.type,
    })
    return { rma, file }
  },
  pendingComponent: LoaderModal,
})
