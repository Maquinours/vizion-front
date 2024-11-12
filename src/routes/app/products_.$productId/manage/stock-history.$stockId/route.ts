import { QueryKey } from '@tanstack/react-query'
import { SearchSchemaInput, createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal'
import { queries } from '../../../../../utils/constants/queryKeys'
import Page from '../../../../../utils/types/Page'
import ProductVersionShelfStockResponseDto from '../../../../../utils/types/ProductVersionShelfStockResponseDto'

const searchSchema = z.object({
  stockHistoryPage: z.number().min(0).catch(0),
})

export const Route = createFileRoute(
  '/app/products_/$productId/manage/stock-history/$stockId',
)({
  validateSearch: (data: { stockHistoryPage?: number } & SearchSchemaInput) =>
    searchSchema.parse(data),
  loaderDeps: ({ search: { stockHistoryPage } }) => ({
    page: stockHistoryPage,
    size: 5,
  }),
  loader: async ({
    context: { queryClient },
    params: { stockId },
    deps: { page, size },
  }) => {
    queryClient.prefetchQuery(
      queries[
        'product-version-shelf-stock-entries'
      ].page._ctx.byProductShelfStockId(stockId, { page, size }),
    )

    let initialDataKey: QueryKey | undefined = undefined
    await queryClient.ensureQueryData({
      ...queries['product-version-shelf-stocks'].detail._ctx.byId(stockId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<
          Page<ProductVersionShelfStockResponseDto>
        >({
          queryKey: queries['product-version-shelf-stocks'].page.queryKey,
        })) {
          const item = value?.content.find((item) => item.id === stockId)
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
