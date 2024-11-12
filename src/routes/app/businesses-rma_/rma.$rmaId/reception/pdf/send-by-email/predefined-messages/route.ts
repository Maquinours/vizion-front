import { createFileRoute } from '@tanstack/react-router'
import LoaderModal from '../../../../../../../../components/LoaderModal/LoaderModal'

export const Route = createFileRoute(
  '/app/businesses-rma_/rma/$rmaId/reception/pdf/send-by-email/predefined-messages',
)({
  pendingComponent: LoaderModal,
})
