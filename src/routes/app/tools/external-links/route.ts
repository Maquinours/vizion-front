import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { externalLinkQueryKeys } from '../../../../utils/constants/queryKeys/externalLink';
import { getExternalLinksPageByArchiveState } from '../../../../utils/api/externalLink';

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
    queryClient.ensureQueryData({
      queryKey: externalLinkQueryKeys.pageByArchiveState(archiveState, page, size),
      queryFn: () => getExternalLinksPageByArchiveState(archiveState, page, size),
    });
  },
});
