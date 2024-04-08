import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { queries } from '../../../utils/constants/queryKeys';
import { enterprises } from '../../../utils/constants/queryKeys/enterprise';

const searchSchema = z.object({
  productModal: z.enum(['update', 'delete']).optional().catch(undefined),
});

export const Route = createFileRoute('/app/products/$productId')({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { productModal } }) => ({ productModal }),
  loader: ({ context: { queryClient }, params: { productId }, deps: { productModal } }) => {
    queryClient.ensureQueryData(queries.product.detail._ctx.byId(productId));
    if (productModal === 'update') {
      queryClient.ensureQueryData(enterprises.list._ctx.providers);
    }
  },
});
