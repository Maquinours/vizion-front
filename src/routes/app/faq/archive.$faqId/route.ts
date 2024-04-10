import { createFileRoute } from '@tanstack/react-router';
import { faqs } from '../../../../utils/constants/queryKeys/faq';

export const Route = createFileRoute('/app/faq/archive/$faqId')({
  loader: async ({ context: { queryClient }, params: { faqId } }) => {
    await queryClient.ensureQueryData(faqs.detail._ctx.byId(faqId));
  },
});
