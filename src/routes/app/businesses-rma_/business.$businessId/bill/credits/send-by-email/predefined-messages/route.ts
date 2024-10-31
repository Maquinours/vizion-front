import { createFileRoute } from '@tanstack/react-router'
import { queries } from '../../../../../../../../utils/constants/queryKeys'
import LoaderModal from '../../../../../../../../components/LoaderModal/LoaderModal'

export const Route = createFileRoute(
  '/app/businesses-rma_/business/$businessId/bill/credits/send-by-email/predefined-messages',
)({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(queries['predefined-message'].list)
  },
  pendingComponent: LoaderModal,
})
