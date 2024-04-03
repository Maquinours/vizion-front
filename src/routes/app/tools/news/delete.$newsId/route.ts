import { createFileRoute } from '@tanstack/react-router';
import { newsQueryKeys } from '../../../../../utils/constants/queryKeys/news';
import { getNewsById } from '../../../../../utils/api/news';
import Page from '../../../../../utils/types/Page';
import NewsResponseDto from '../../../../../utils/types/NewsResponseDto';
import { QueryKey } from '@tanstack/react-query';

export const Route = createFileRoute('/app/tools/news/delete/$newsId')({
  loader: async ({ context: { queryClient }, params: { newsId } }) => {
    let initialDataKey: QueryKey | undefined;
    await queryClient.ensureQueryData({
      queryKey: newsQueryKeys.detailById(newsId),
      queryFn: () => getNewsById(newsId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<Page<NewsResponseDto>>({ queryKey: newsQueryKeys.pages() })) {
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
});
