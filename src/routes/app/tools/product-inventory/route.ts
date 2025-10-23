import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { queries } from '../../../../utils/constants/queryKeys';

const searchSchema = z.object({
  page: z.number().min(0).catch(0),
  shelfId: z.uuid().optional().catch(undefined),
  versionId: z.uuid().optional().catch(undefined),
});

export const Route = createFileRoute('/app/tools/product-inventory')({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { page, shelfId, versionId } }) => ({ page, shelfId, versionId, size: 20 }),
  loader: ({ context: { queryClient }, deps: { page, shelfId, versionId: productVersionId, size } }) => {
    queryClient.prefetchQuery(queries['product-version-shelf-stocks'].page._ctx.all({ productVersionId, shelfId }, { page, size }));
  },
  staticData: {
    title: 'Inventaire',
  },
});
