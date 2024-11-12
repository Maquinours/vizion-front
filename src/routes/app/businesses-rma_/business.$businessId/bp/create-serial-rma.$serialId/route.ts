import { createFileRoute } from '@tanstack/react-router'
import { queries } from '../../../../../../utils/constants/queryKeys'
import BusinessBpResponseDto from '../../../../../../utils/types/BusinessBpResponseDto'
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal'

export const Route = createFileRoute(
  '/app/businesses-rma_/business/$businessId/bp/create-serial-rma/$serialId',
)({
  loader: async ({
    context: { queryClient },
    params: { businessId, serialId },
  }) => {
    await queryClient.ensureQueryData({
      ...queries['business-bp-serials'].detail._ctx.byId(serialId),
      initialData: () =>
        queryClient
          .getQueryData<BusinessBpResponseDto>(
            queries['business-bps'].detail._ctx.byBusinessId(businessId)
              .queryKey,
          )
          ?.bpDetailsList?.flatMap((detail) => detail.bpSerialList ?? [])
          .find((serial) => serial.id === serialId),
      initialDataUpdatedAt: () =>
        queryClient.getQueryState(
          queries['business-bps'].detail._ctx.byBusinessId(businessId).queryKey,
        )?.dataUpdatedAt,
    })
  },
  pendingComponent: LoaderModal,
})
