import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { productQueryKeys } from '../../../utils/constants/queryKeys/product';
import { getProductById } from '../../../utils/api/product';
import enterpriseQueryKeys from '../../../utils/constants/queryKeys/enterprise';
import { getProviderEnterprises } from '../../../utils/api/enterprise';

const searchSchema = z.object({
  productModal: z.enum(['update', 'delete']).optional().catch(undefined),
});

export const Route = createFileRoute('/app/products/$productId')({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { productModal } }) => ({ productModal }),
  loader: ({ context: { queryClient }, params: { productId }, deps: { productModal } }) => {
    queryClient.ensureQueryData({
      queryKey: productQueryKeys.detailById(productId),
      queryFn: () => getProductById(productId),
    });
    if (productModal === 'update') {
      queryClient.ensureQueryData({
        queryKey: enterpriseQueryKeys.listProviders(),
        queryFn: getProviderEnterprises,
      });
    }
  },
});
