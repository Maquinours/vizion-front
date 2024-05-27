import { createFileRoute } from '@tanstack/react-router';
import { externalLinks } from '../../../utils/constants/queryKeys/externalLink';
import Page from '../../../utils/types/Page';
import ExternalLinkResponseDto from '../../../utils/types/ExternalLinkResponseDto';
import { QueryKey } from '@tanstack/react-query';
import { queries } from '../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/external-links/$externalLinkId')({
  loader: async ({ context: { queryClient }, params: { externalLinkId } }) => {
    let initialDataKey: QueryKey | undefined = undefined;
    await queryClient.ensureQueryData({
      ...externalLinks.detail._ctx.byId(externalLinkId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<Page<ExternalLinkResponseDto>>({ queryKey: externalLinks.page._def })) {
          const item = value?.content.find((item) => item.id === externalLinkId);
          if (item) {
            initialDataKey = key;
            return item;
          }
        }
      },
      initialDataUpdatedAt: () => (initialDataKey ? queryClient.getQueryState(initialDataKey)?.dataUpdatedAt : undefined),
    });
  },
  staticData: {
    getTitle: (queryClient, match) =>
      queryClient
        .ensureQueryData(queries['external-link'].detail._ctx.byId((match.params as { externalLinkId: string }).externalLinkId))
        .then((externalLink) => externalLink.title),
  },
});
