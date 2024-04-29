import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewArcViewUpdateShippingPriceModalView from '../../../../../../views/App/views/Business/views/Arc/views/UpdateShippingPriceModal/UpdateShippingPriceModal';

export const Route = createLazyFileRoute('/app/businesses-rma/business/$businessId/arc/update-shipping-price')({
  component: AppViewBusinessViewArcViewUpdateShippingPriceModalView,
});
