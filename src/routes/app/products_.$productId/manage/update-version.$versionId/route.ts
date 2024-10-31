import { createFileRoute, notFound } from '@tanstack/react-router'
import { queries } from '../../../../../utils/constants/queryKeys'
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal'
import Page from '../../../../../utils/types/Page'
import ProductVersionResponseDto from '../../../../../utils/types/ProductVersionResponseDto'
import { QueryKey } from '@tanstack/react-query'

export const Route = createFileRoute(
  '/app/products_/$productId/manage/update-version/$versionId',
)({
  loader: async ({
    context: { queryClient },
    params: { productId, versionId },
  }) => {
    let initialDataKey: QueryKey | undefined = undefined
    const version = await queryClient.ensureQueryData({
      ...queries['product-versions'].detail._ctx.byId(versionId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<
          Page<ProductVersionResponseDto>
        >({
          queryKey: queries['product-versions'].page.queryKey,
        })) {
          const item = value?.content.find((item) => item.id === versionId)
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
    if (!version.product || version.product.id !== productId) throw notFound()
  },
  pendingComponent: LoaderModal,
})
