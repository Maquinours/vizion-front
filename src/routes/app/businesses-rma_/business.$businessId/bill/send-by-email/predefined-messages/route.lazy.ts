import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewBillViewSendByEmailModalViewPredefinedMessagesModalView from '../../../../../../../views/App/views/Business/views/Bill/views/SendByEmailModal/views/PredefinedMessagesModal/PredefinedMessagesModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/bill/send-by-email/predefined-messages')({
  component: AppViewBusinessViewBillViewSendByEmailModalViewPredefinedMessagesModalView,
});
