import { createFileRoute, redirect } from '@tanstack/react-router';
import { externalLinks } from '../../../../../utils/constants/queryKeys/externalLink';

export const Route = createFileRoute('/app/tools/external-links/delete/$externalLinkId')({
  loader: async ({ context: { queryClient }, params: { externalLinkId } }) => {
    const externalLink = await queryClient.ensureQueryData(externalLinks.detail._ctx.byId(externalLinkId));
    if (!externalLink) throw redirect({ from: Route.id, to: '../..', search: (old) => old });
  },
});
