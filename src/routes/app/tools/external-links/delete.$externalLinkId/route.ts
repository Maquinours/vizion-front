import { createFileRoute, redirect } from '@tanstack/react-router';
import { externalLinks } from '../../../../../utils/constants/queryKeys/externalLink';
import { QueryKey } from '@tanstack/react-query';
import Page from '../../../../../utils/types/Page';
import ExternalLinkResponseDto from '../../../../../utils/types/ExternalLinkResponseDto';

export const Route = createFileRoute('/app/tools/external-links/delete/$externalLinkId')({
  loader: async ({ context: { queryClient }, params: { externalLinkId } }) => {
    let initialDataKey: QueryKey | undefined = undefined;

    const externalLink = await queryClient.ensureQueryData({
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

    if (!externalLink) throw redirect({ from: Route.id, to: '../..', search: (old) => old });
  },
});
