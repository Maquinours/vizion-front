import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { queries } from '../../../../../utils/constants/queryKeys';

const searchSchema = z.object({
  search: z.string().optional().catch(undefined),
  page: z.number().int().min(0).catch(0),
});

export const Route = createFileRoute('/app/enterprises/$enterpriseId/address-book')({
  loaderDeps: ({ search: { search, page } }) => ({
    search,
    page,
    size: 9,
  }),
  loader: ({ context: { queryClient }, params: { enterpriseId }, deps: { search, page, size } }) => {
    queryClient.ensureQueryData(queries.address.page._ctx.searchByEnterpriseId({ enterpriseId, searchText: search }, { page, size }));
  },
  validateSearch: searchSchema,
});
