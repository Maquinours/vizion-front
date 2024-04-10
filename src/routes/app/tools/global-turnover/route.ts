import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { queries } from '../../../../utils/constants/queryKeys';

const nowYear = new Date().getFullYear();

const searchSchema = z.object({
  year: z.number().min(2015).max(nowYear).catch(nowYear),
});

export const Route = createFileRoute('/app/tools/global-turnover')({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { year } }) => ({ year }),
  loader: ({ context: { queryClient }, deps: { year } }) => {
    queryClient.prefetchQuery(queries.turnovers.detail(year));
  },
});
