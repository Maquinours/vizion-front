import { createFileRoute } from '@tanstack/react-router';
import { getExternalLinkById } from '../../../utils/api/externalLink';
import { externalLinkQueryKeys } from '../../../utils/constants/queryKeys/externalLink';

export const Route = createFileRoute('/app/external-links/$externalLinkId')({
  loader: ({ context: { queryClient }, params: { externalLinkId } }) => {
    queryClient.ensureQueryData({
      queryKey: externalLinkQueryKeys.detailById(externalLinkId),
      queryFn: () => getExternalLinkById(externalLinkId),
    });
  },
});
