import { createFileRoute } from '@tanstack/react-router';
import { getExternalLinksPageByArchiveState } from '../../../utils/api/externalLink';
import { externalLinkQueryKeys } from '../../../utils/constants/queryKeys/externalLink';

export const Route = createFileRoute('/app/external-links')({
  loader: ({ context: { queryClient } }) => {
    const archived = false;
    const page = 0;
    const size = 12;

    queryClient.ensureQueryData({
      queryKey: externalLinkQueryKeys.pageByArchiveState(archived, page, size),
      queryFn: () => getExternalLinksPageByArchiveState(archived, page, size),
    });
  },
});
