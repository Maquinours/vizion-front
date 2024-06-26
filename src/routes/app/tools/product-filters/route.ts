import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { queries } from '../../../../utils/constants/queryKeys';

const searchSchema = z.object({
  page: z.number().min(0).catch(0),
});

export const Route = createFileRoute('/app/tools/product-filters')({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { page } }) => ({ page, size: 20 }),
  loader: ({ context: { queryClient }, deps: { page, size } }) => {
    queryClient.prefetchQuery(queries['product-filter'].page._ctx.all({ page, size }));
  },
  staticData: {
    title: 'Filtres',
  },
});
