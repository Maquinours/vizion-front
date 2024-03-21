import { createFileRoute, defer } from '@tanstack/react-router';
import { z } from 'zod';
import { addressQueryKeys } from '../../../../../utils/constants/queryKeys/address';
import { searchPaginatedAddressesByEnterpriseId } from '../../../../../utils/api/address';

const searchSchema = z.object({
  search: z.string().optional().catch(undefined),
  page: z.number().int().min(0).catch(0),
});

export const Route = createFileRoute('/app/enterprises/$enterpriseId/address-book')({
  loaderDeps: ({ search: { search, page } }) => ({
    search,
    page,
  }),
  loader: ({ context: { queryClient }, params: { enterpriseId }, deps: { search, page } }) => {
    const size = 9;
    const searchValue = search ?? '';
    const dataPromise = queryClient.ensureQueryData({
      queryKey: addressQueryKeys.pageByEnterpriseIdWithSearch(enterpriseId, searchValue, page, size),
      queryFn: () => searchPaginatedAddressesByEnterpriseId(enterpriseId, searchValue, page, size),
    });

    return { data: defer(dataPromise) };
  },
  validateSearch: searchSchema,
});
