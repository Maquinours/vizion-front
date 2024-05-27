import { QueryKey } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { news } from '../../../../../utils/constants/queryKeys/news';
import NewsResponseDto from '../../../../../utils/types/NewsResponseDto';
import Page from '../../../../../utils/types/Page';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/tools/news/delete/$newsId')({
  loader: async ({ context: { queryClient }, params: { newsId } }) => {
    let initialDataKey: QueryKey | undefined;
    await queryClient.ensureQueryData({
      ...news.detail._ctx.byId(newsId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<Page<NewsResponseDto>>({ queryKey: news.page._def })) {
          const item = value?.content.find((news) => news.id === newsId);
          if (item) {
            initialDataKey = key;
            return item;
          }
        }
      },
      initialDataUpdatedAt: () => (initialDataKey ? queryClient.getQueryState(initialDataKey)?.dataUpdatedAt : undefined),
    });
  },
  pendingComponent: LoaderModal,
});
