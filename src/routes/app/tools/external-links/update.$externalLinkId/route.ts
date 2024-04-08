import { createFileRoute } from '@tanstack/react-router';
import { externalLinks } from '../../../../../utils/constants/queryKeys/externalLink';

export const Route = createFileRoute('/app/tools/external-links/update/$externalLinkId')({
  loader: ({ context: { queryClient }, params: { externalLinkId } }) => {
    queryClient.ensureQueryData(externalLinks.detail._ctx.byId(externalLinkId));
  },
});
