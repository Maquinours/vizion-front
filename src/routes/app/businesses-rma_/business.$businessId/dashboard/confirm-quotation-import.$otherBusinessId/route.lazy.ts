import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewDashboardViewConfirmOtherQuotationImportModalView from '../../../../../../views/App/views/Business/views/Dashboard/views/ConfirmOtherQuotationImportModal/ConfirmOtherQuotationImportModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/dashboard/confirm-quotation-import/$otherBusinessId')({
  component: AppViewBusinessViewDashboardViewConfirmOtherQuotationImportModalView,
});
