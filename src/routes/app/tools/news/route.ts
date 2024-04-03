import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { newsQueryKeys } from '../../../../utils/constants/queryKeys/news';
import { getNewsPage } from '../../../../utils/api/news';

const searchSchema = z.object({
  page: z.number().min(0).catch(0),
});

export const Route = createFileRoute('/app/tools/news')({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { page } }) => ({ page, size: 15 }),
  loader: async ({ context: { queryClient }, deps: { page, size } }) => {
    queryClient.prefetchQuery({ queryKey: newsQueryKeys.page(page, size), queryFn: () => getNewsPage(page, size) });
  },
});
