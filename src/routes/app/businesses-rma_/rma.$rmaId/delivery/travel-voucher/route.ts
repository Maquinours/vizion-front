import { createFileRoute } from '@tanstack/react-router'
import { queries } from '../../../../../../utils/constants/queryKeys'
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal'

export const Route = createFileRoute(
  '/app/businesses-rma_/rma/$rmaId/delivery/travel-voucher',
)({
  loader: async ({ context: { queryClient }, params: { rmaId } }) => {
    return {
      rma: await queryClient.ensureQueryData(queries.rmas.detail(rmaId)),
    }
  },
  pendingComponent: LoaderModal,
})
