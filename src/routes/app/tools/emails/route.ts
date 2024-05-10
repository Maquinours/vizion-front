import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { queries } from '../../../../utils/constants/queryKeys';

const searchSchema = z.object({
  search: z.string().optional().catch(undefined),
  spam: z.boolean().optional().catch(undefined),
  page: z.number().min(0).catch(0),
});

export const Route = createFileRoute('/app/tools/emails')({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { search, spam, page } }) => ({ search, spam, page, size: 15 }),
  loader: ({ context: { queryClient }, deps: { search, spam, page, size } }) => {
    queryClient.prefetchQuery(queries.emails.page._ctx.bySpamStateAndSearch(spam ?? false, search, { page, size }));
  },
  staticData: {
    title: 'Emails',
  },
});
