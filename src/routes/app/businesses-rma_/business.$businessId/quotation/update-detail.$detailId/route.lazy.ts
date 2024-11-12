import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewQuotationViewUpdateDetailModalView from '../../../../../../views/App/views/Business/views/Quotation/views/UpdateDetailModal/UpdateDetailModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/quotation/update-detail/$detailId')({
  component: AppViewBusinessViewQuotationViewUpdateDetailModalView,
});
