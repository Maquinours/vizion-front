import { createFileRoute } from '@tanstack/react-router';
import { externalLinkQueryKeys } from '../../../../../utils/constants/queryKeys/externalLink';
import { getExternalLinkById } from '../../../../../utils/api/externalLink';

export const Route = createFileRoute('/app/tools/external-links/update/$externalLinkId')({
  loader: ({ context: { queryClient }, params: { externalLinkId } }) => {
    queryClient.ensureQueryData({
      queryKey: externalLinkQueryKeys.detailById(externalLinkId),
      queryFn: () => getExternalLinkById(externalLinkId),
    });
  },
});
