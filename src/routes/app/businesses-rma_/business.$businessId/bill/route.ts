import { createFileRoute } from '@tanstack/react-router'
import { queries } from '../../../../../utils/constants/queryKeys'

export const Route = createFileRoute(
  '/app/businesses-rma_/business/$businessId/bill',
)({
  loader: async ({ context: { queryClient }, params: { businessId } }) => {
    await queryClient.ensureQueryData(
      queries['business-bills'].list._ctx.byBusinessId(businessId),
    )
  },
})
