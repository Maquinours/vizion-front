import { createFileRoute } from '@tanstack/react-router';
import { faqQueryKeys } from '../../../../utils/constants/queryKeys/faq';
import { getFaqById } from '../../../../utils/api/faq';

export const Route = createFileRoute('/app/faq/archive/$faqId')({
  loader: ({ context: { queryClient }, params: { faqId } }) => {
    queryClient.ensureQueryData({
      queryKey: faqQueryKeys.detailById(faqId),
      queryFn: () => getFaqById(faqId),
    });
  },
});
