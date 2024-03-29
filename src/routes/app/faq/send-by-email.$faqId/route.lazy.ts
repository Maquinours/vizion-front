import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewFaqViewSendByEmailModalView from '../../../../views/App/views/Faq/views/SendByEmailModal/SendByEmailModal';

export const Route = createLazyFileRoute('/app/faq/send-by-email/$faqId')({
  component: AppViewFaqViewSendByEmailModalView,
});
