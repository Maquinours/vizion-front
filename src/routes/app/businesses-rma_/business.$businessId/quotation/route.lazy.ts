import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewQuotationView from '../../../../../views/App/views/Business/views/Quotation/Quotation';

export const Route = createLazyFileRoute('/app/businesses-rma/business/$businessId/quotation')({
  component: AppViewBusinessViewQuotationView,
});
