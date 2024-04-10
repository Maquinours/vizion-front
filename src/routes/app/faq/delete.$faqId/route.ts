import { createFileRoute } from '@tanstack/react-router';
import { faqs } from '../../../../utils/constants/queryKeys/faq';

export const Route = createFileRoute('/app/faq/delete/$faqId')({
  loader: ({ context: { queryClient }, params: { faqId } }) => {
    queryClient.ensureQueryData(faqs.detail._ctx.byId(faqId));
  },
});
