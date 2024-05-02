import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { queries } from '../../../../utils/constants/queryKeys';

const searchSchema = z.object({
  page: z.number().min(0).catch(0),
});

export const Route = createFileRoute('/app/tools/predefined-texts')({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { page } }) => ({ page, size: 50 }),
  loader: ({ context: { queryClient }, deps: { page, size } }) => {
    queryClient.prefetchQuery(queries['predefined-text'].page({ page, size }));
  },
  staticData: {
    title: 'Textes prédéfinis',
  },
});
