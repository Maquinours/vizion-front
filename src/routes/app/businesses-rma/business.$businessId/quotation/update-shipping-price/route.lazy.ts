import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewQuotationViewUpdateShippingPriceModalView from '../../../../../../views/App/views/Business/views/Quotation/views/UpdateShippingPriceModal/UpdateShippingPriceModal';

export const Route = createLazyFileRoute('/app/businesses-rma/business/$businessId/quotation/update-shipping-price')({
  component: AppViewBusinessViewQuotationViewUpdateShippingPriceModalView,
});
