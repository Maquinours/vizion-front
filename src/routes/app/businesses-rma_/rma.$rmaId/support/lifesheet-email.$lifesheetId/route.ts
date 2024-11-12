import { createFileRoute, notFound } from '@tanstack/react-router'
import { queries } from '../../../../../../utils/constants/queryKeys'
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal'
import LifeSheetResponseDto from '../../../../../../utils/types/LifeSheetResponseDto'
import { QueryKey } from '@tanstack/react-query'
import Page from '../../../../../../utils/types/Page'

export const Route = createFileRoute(
  '/app/businesses-rma_/rma/$rmaId/support/lifesheet-email/$lifesheetId',
)({
  loader: async ({ context: { queryClient }, params: { lifesheetId } }) => {
    let initialDataKey: QueryKey | undefined = undefined
    const lifesheet = await queryClient.ensureQueryData({
      ...queries.lifesheets.detail._ctx.byId(lifesheetId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<
          Page<LifeSheetResponseDto>
        >({
          queryKey: queries.lifesheets.page._def,
        })) {
          const item = value?.content.find((item) => item.id === lifesheetId)
          if (item) {
            initialDataKey = key
            return item
          }
        }
      },
      initialDataUpdatedAt: () =>
        initialDataKey
          ? queryClient.getQueryState(initialDataKey)?.dataUpdatedAt
          : undefined,
    })
    if (!lifesheet.mailId) throw notFound()
    const email = await queryClient.ensureQueryData(
      queries.emails.detail(lifesheet.mailId),
    )
    if (!email) throw notFound()
  },
  pendingComponent: LoaderModal,
})
