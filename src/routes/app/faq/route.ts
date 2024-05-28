import { SearchSchemaInput, createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { faqs } from '../../../utils/constants/queryKeys/faq';

const searchSchema = z.object({
  search: z.string().optional().catch(undefined),
  page: z.number().catch(0),
  archived: z.boolean().catch(false),
});

export const Route = createFileRoute('/app/faq')({
  validateSearch: (data: { search?: string; page?: number; archived?: boolean } & SearchSchemaInput) => searchSchema.parse(data),
  loaderDeps: ({ search: { search, page, archived } }) => ({ search, page, size: 15, archived }),
  loader: ({ context: { queryClient }, deps: { search, page, size, archived } }) => {
    queryClient.ensureQueryData(faqs.page({ page, size })._ctx.byArchiveStateAndSearch(archived, search));
  },
  staticData: {
    title: 'FAQ',
  },
});
