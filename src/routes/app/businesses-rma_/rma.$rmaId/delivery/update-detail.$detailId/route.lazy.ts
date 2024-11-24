import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewRmaViewDeliveryViewUpdateDetailModalView from '../../../../../../views/App/views/Rma/views/Delivery/views/UpdateDetailModal/UpdateDetailModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/rma/$rmaId/delivery/update-detail/$detailId')({
  component: AppViewRmaViewDeliveryViewUpdateDetailModalView,
});
