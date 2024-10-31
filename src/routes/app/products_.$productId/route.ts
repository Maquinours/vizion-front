import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { queries } from '../../../utils/constants/queryKeys'
import { enterprises } from '../../../utils/constants/queryKeys/enterprise'
import { QueryKey } from '@tanstack/react-query'
import Page from '../../../utils/types/Page'
import ProductResponseDto from '../../../utils/types/ProductResponseDto'
import * as Sentry from '@sentry/react'

const searchSchema = z.object({
  productModal: z.enum(['update', 'delete']).optional().catch(undefined),
})

export const Route = createFileRoute('/app/products_/$productId')({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { productModal } }) => ({ productModal }),
  loader: async ({
    context: { queryClient },
    params: { productId },
    deps: { productModal },
  }) => {
    let initialDataKey: QueryKey | undefined = undefined
    const productPromise = queryClient.ensureQueryData({
      ...queries.product.detail(productId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<
          Page<ProductResponseDto>
        >({ queryKey: queries.product.page._def })) {
          try {
            const item = value?.content.find((item) => item.id === productId)
            if (item) {
              initialDataKey = key
              return item
            }
          } catch (error) {
            console.error(error, value)
            Sentry.captureException(error, (scope) => {
              scope.setTag('type', 'query-cache-error')
              scope.setExtra('value', value)
              return scope
            })
          }
        }
      },
      initialDataUpdatedAt: () =>
        initialDataKey
          ? queryClient.getQueryState(initialDataKey)?.dataUpdatedAt
          : undefined,
    })

    if (productModal === 'update') {
      await queryClient.ensureQueryData(enterprises.list._ctx.providers)
    }
    await productPromise
  },
  staticData: {
    getTitle: (queryClient, match) =>
      queryClient
        .ensureQueryData(
          queries.product.detail(
            (match.params as { productId: string }).productId,
          ),
        )
        .then((product) => product.reference ?? 'Produit inconnu'),
  },
})
