import { createFileRoute, notFound } from '@tanstack/react-router';
import { externalLinkQueryKeys } from '../../../../../utils/constants/queryKeys/externalLink';
import { getExternalLinkById } from '../../../../../utils/api/externalLink';

export const Route = createFileRoute('/app/tools/external-links/delete/$externalLinkId')({
  loader: async ({ context: { queryClient }, params: { externalLinkId } }) => {
    const externalLink = await queryClient.ensureQueryData({
      queryKey: externalLinkQueryKeys.detailById(externalLinkId),
      queryFn: () => getExternalLinkById(externalLinkId),
    });
    if (!externalLink) throw notFound();
  },
});
