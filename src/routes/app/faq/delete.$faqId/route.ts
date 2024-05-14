import { createFileRoute } from '@tanstack/react-router';
import { faqs } from '../../../../utils/constants/queryKeys/faq';
import { QueryKey } from '@tanstack/react-query';
import Page from '../../../../utils/types/Page';
import FaqResponseDto from '../../../../utils/types/FaqResponseDto';

export const Route = createFileRoute('/app/faq/delete/$faqId')({
  loader: async ({ context: { queryClient }, params: { faqId } }) => {
    let initialDataKey: QueryKey | undefined = undefined;
    await queryClient.ensureQueryData({
      ...faqs.detail._ctx.byId(faqId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<Page<FaqResponseDto>>({ queryKey: faqs.page._def })) {
          const item = value?.content.find((item) => item.id === faqId);
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
