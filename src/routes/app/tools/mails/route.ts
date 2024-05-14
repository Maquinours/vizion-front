import { SearchSchemaInput, createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { mailQueryKeys } from '../../../../utils/constants/queryKeys/mails';

const searchSchema = z.object({
  search: z.string().optional().catch(undefined),
  page: z.number().default(0),
});

export const Route = createFileRoute('/app/tools/mails')({
  validateSearch: (data: { search?: string; page?: number } & SearchSchemaInput) => searchSchema.parse(data),
  loaderDeps: ({ search: { search, page } }) => ({ search, page, size: 20 }),
  loader: ({ context: { queryClient }, deps: { search, page, size } }) => {
    queryClient.prefetchQuery(mailQueryKeys.page._ctx.all({ page, size }, search));
  },
});
