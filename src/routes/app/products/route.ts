import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { queries } from '../../../utils/constants/queryKeys';

const searchSchema = z.object({
  designation: z.string().optional().catch(undefined),
  ref: z.string().optional().catch(undefined),
  page: z.number().min(0).catch(0),
});

export const Route = createFileRoute('/app/products')({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { designation, ref, page } }) => ({ designation, ref, page, size: 20 }),
  loader: ({ context: { queryClient }, deps: { designation, ref, page, size } }) => {
    queryClient.prefetchQuery(queries.product.page({ page, size })._ctx.search({ designation, ref }));
  },
});
