import { createFileRoute } from '@tanstack/react-router';
import { externalLinks } from '../../../../../utils/constants/queryKeys/externalLink';

export const Route = createFileRoute('/app/tools/external-links/archive/$externalLinkId')({
  loader: async ({ context: { queryClient }, params: { externalLinkId } }) => {
    await queryClient.ensureQueryData(externalLinks.detail._ctx.byId(externalLinkId));
  },
});
