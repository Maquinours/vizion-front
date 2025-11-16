import { SearchSchemaInput, createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { faqs } from '../../../utils/constants/queryKeys/faq';
import FaqAccessLevel from '../../../utils/enums/FaqAccessLevel';

const searchSchema = z.object({
  search: z.string().optional().catch(undefined),
  productId: z.uuid().optional().catch(undefined),
  accessLevel: z.enum(FaqAccessLevel).optional().catch(undefined),
  page: z.number().catch(0),
  archived: z.boolean().catch(false),
  fuzzy: z.boolean().catch(false),
});

export const Route = createFileRoute('/app/faq')({
  validateSearch: (data: { search?: string; page?: number; archived?: boolean } & SearchSchemaInput) => searchSchema.parse(data),
  loaderDeps: ({ search: { search, productId, accessLevel, page, archived, fuzzy } }) => ({ search, productId, accessLevel, page, size: 15, archived, fuzzy }),
  loader: ({ context: { queryClient }, deps: { search, productId, accessLevel, page, size, archived, fuzzy } }) => {
    queryClient.ensureQueryData(faqs.page({ page, size })._ctx.byArchiveStateAndSearch(archived, search, productId, accessLevel, fuzzy));
  },
  staticData: {
    title: 'FAQ',
  },
});
