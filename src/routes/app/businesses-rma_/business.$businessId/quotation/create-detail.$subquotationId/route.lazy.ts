import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewQuotationViewCreateDetailModalView from '../../../../../../views/App/views/Business/views/Quotation/views/CreateDetailModal/CreateDetailModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/quotation/create-detail/$subquotationId')({
  component: AppViewBusinessViewQuotationViewCreateDetailModalView,
});
