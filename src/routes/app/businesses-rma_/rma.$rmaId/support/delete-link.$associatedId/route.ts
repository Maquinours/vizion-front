import { QueryKey } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { queries } from '../../../../../../utils/constants/queryKeys'
import AllBusinessResponseDto from '../../../../../../utils/types/AllBusinessResponseDto'
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal'

export const Route = createFileRoute(
  '/app/businesses-rma_/rma/$rmaId/support/delete-link/$associatedId',
)({
  loader: async ({ context: { queryClient }, params: { associatedId } }) => {
    let initialDataKey: QueryKey | undefined

    await queryClient.ensureQueryData({
      ...queries['all-businesses'].detail._ctx.byId(associatedId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<
          Array<AllBusinessResponseDto>
        >({ queryKey: queries['all-businesses'].list.queryKey })) {
          const item = value?.find((item) => item.id === associatedId)
          if (item) {
            initialDataKey = key
            return item
          }
        }
      },
      initialDataUpdatedAt: initialDataKey
        ? queryClient.getQueryState(initialDataKey)?.dataUpdatedAt
        : undefined,
    })
  },
  pendingComponent: LoaderModal,
})
