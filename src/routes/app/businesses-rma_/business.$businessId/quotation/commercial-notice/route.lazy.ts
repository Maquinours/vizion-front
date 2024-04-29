import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewQuotationViewCommercialNoticeModalView from '../../../../../../views/App/views/Business/views/Quotation/views/CommercialNoticeModal/CommercialNoticeModal';

export const Route = createLazyFileRoute('/app/businesses-rma/business/$businessId/quotation/commercial-notice')({
  component: AppViewBusinessViewQuotationViewCommercialNoticeModalView,
});
