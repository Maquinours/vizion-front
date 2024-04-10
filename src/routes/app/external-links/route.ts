import { createFileRoute } from '@tanstack/react-router';
import { externalLinks } from '../../../utils/constants/queryKeys/externalLink';

export const Route = createFileRoute('/app/external-links')({
  loader: ({ context: { queryClient } }) => {
    const archived = false;
    const page = 0;
    const size = 12;

    queryClient.ensureQueryData(externalLinks.page({ page, size })._ctx.byArchiveState(archived));
  },
});
