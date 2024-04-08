import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { news } from '../../../../utils/constants/queryKeys/news';

const searchSchema = z.object({
  page: z.number().min(0).catch(0),
});

export const Route = createFileRoute('/app/tools/news')({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { page } }) => ({ page, size: 15 }),
  loader: async ({ context: { queryClient }, deps: { page, size } }) => {
    queryClient.prefetchQuery(news.page({ page, size }));
  },
});
