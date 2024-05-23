import { SearchSchemaInput, createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { queries } from '../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';

const searchSchema = z.object({
  search: z.string().optional().catch(undefined),
  page: z.number().int().min(0).catch(0),
});

export const Route = createFileRoute('/app/enterprises/$enterpriseId/address-book')({
  validateSearch: (data: { search?: string; page?: number } & SearchSchemaInput) => searchSchema.parse(data),
  loaderDeps: ({ search: { search, page } }) => ({
    search,
    page,
    size: 9,
  }),
  loader: ({ context: { queryClient }, params: { enterpriseId }, deps: { search, page, size } }) => {
    queryClient.prefetchQuery(queries.address.page._ctx.searchByEnterpriseId({ enterpriseId, searchText: search }, { page, size }));
  },
  pendingComponent: LoaderModal,
});
