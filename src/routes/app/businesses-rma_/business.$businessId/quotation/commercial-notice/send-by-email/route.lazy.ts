import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewQuotationViewCommercialNoticeModalViewSendByEmailModalView from '../../../../../../../views/App/views/Business/views/Quotation/views/CommercialNoticeModal/views/SendByEmailModal/SendByEmailModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/quotation/commercial-notice/send-by-email')({
  component: AppViewBusinessViewQuotationViewCommercialNoticeModalViewSendByEmailModalView,
});
