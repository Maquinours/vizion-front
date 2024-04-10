import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { externalLinks } from '../../../../utils/constants/queryKeys/externalLink';

const searchSchema = z.object({
  page: z.number().min(0).catch(0),
  archiveState: z.boolean().catch(false),
});

export const Route = createFileRoute('/app/tools/external-links')({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { page, archiveState } }) => ({
    page,
    size: 15,
    archiveState,
  }),
  loader: ({ context: { queryClient }, deps: { page, size, archiveState } }) => {
    queryClient.ensureQueryData(externalLinks.page({ page, size })._ctx.byArchiveState(archiveState));
  },
});
