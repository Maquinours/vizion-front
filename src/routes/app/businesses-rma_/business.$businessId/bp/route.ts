import { createFileRoute } from '@tanstack/react-router'
import { queries } from '../../../../../utils/constants/queryKeys'

export const Route = createFileRoute(
  '/app/businesses-rma_/business/$businessId/bp',
)({
  loader: async ({ context: { queryClient }, params: { businessId } }) => {
    queryClient.prefetchQuery(queries['product-stocks'].list._ctx.all)
    await queryClient.ensureQueryData(
      queries['business-bps'].detail._ctx.byBusinessId(businessId),
    )
  },
})
