import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewBillViewCreditsModalViewSendByEmailModalView from '../../../../../../../views/App/views/Business/views/Bill/views/CreditsModal/views/SendByEmailModal/SendByEmailModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/bill/credits/send-by-email')({
  component: AppViewBusinessViewBillViewCreditsModalViewSendByEmailModalView,
});
