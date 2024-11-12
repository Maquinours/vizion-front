import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewRmaViewDeliveryView from '../../../../../views/App/views/Rma/views/Delivery/Delivery';

export const Route = createLazyFileRoute('/app/businesses-rma_/rma/$rmaId/delivery')({
  component: AppViewRmaViewDeliveryView,
});
