import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewQuotationViewDeleteDetailModalView from '../../../../../../views/App/views/Business/views/Quotation/views/DeleteDetailModal/DeleteDetailModal';

export const Route = createLazyFileRoute('/app/businesses-rma/business/$businessId/quotation/delete-detail/$detailId')({
  component: AppViewBusinessViewQuotationViewDeleteDetailModalView,
});
