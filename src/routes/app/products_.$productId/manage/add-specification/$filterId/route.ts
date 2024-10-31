import { createFileRoute } from '@tanstack/react-router'
import { queries } from '../../../../../../utils/constants/queryKeys'
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal'
import AdvancedProductSpecificationResponseDto from '../../../../../../utils/types/AdvancedProductSpecificationResponseDto'
import { QueryKey } from '@tanstack/react-query'

export const Route = createFileRoute(
  '/app/products_/$productId/manage/add-specification/$filterId',
)({
  loader: async ({ context: { queryClient }, params: { filterId } }) => {
    let initialDataKey: QueryKey | undefined = undefined

    await queryClient.ensureQueryData({
      ...queries['product-filter'].detail._ctx.byId(filterId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<
          Array<AdvancedProductSpecificationResponseDto>
        >({
          queryKey: queries['product-filter'].list.queryKey,
        })) {
          const item = value?.find((item) => item.id === filterId)
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
  },
  pendingComponent: LoaderModal,
})
