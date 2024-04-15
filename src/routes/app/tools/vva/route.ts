import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { queries } from '../../../../utils/constants/queryKeys';

const searchSchema = z.object({
  page: z.number().min(0).catch(0),
});

export const Route = createFileRoute('/app/tools/vva')({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { page } }) => ({ page, size: 15 }),
  loader: ({ context: { queryClient }, deps: { page, size } }) => {
    queryClient.prefetchQuery(queries['sales-vva'].page({ page, size }));
  },
});
