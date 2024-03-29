import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { getFaqsPageByArchiveState, getFaqsPageByArchiveStateWithSearch } from '../../../utils/api/faq';
import { faqQueryKeys } from '../../../utils/constants/queryKeys/faq';

const searchSchema = z.object({
  search: z.string().optional().catch(undefined),
  page: z.number().catch(0),
  archived: z.boolean().catch(false),
});

export const Route = createFileRoute('/app/faq')({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { search, page, archived } }) => ({ search, page, size: 15, archived }),
  loader: ({ context: { queryClient }, deps: { search, page, size, archived } }) => {
    queryClient.ensureQueryData({
      queryKey: faqQueryKeys.pageByArchiveStateAndSearch(archived, search, page, size),
      queryFn: () => (search ? getFaqsPageByArchiveStateWithSearch(archived, search, page, size) : getFaqsPageByArchiveState(archived, page, size)),
    });
  },
});
