import { createFileRoute } from '@tanstack/react-router'
import { queries } from '../../../../../utils/constants/queryKeys'

export const Route = createFileRoute(
  '/app/businesses-rma_/business/$businessId_/study',
)({
  staticData: {
    getTitle: (queryClient, match) =>
      queryClient
        .ensureQueryData(
          queries.businesses.detail._ctx.byId(
            (match.params as { businessId: string }).businessId,
          ),
        )
        .then((business) => `Synoptique (${business.numBusiness})`),
  },
})
