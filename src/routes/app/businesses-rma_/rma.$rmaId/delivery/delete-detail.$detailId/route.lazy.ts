import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewRmaViewDeliveryViewDeleteDetailModalView from '../../../../../../views/App/views/Rma/views/Delivery/views/DeleteDetailModal/DeleteDetailModal';

export const Route = createLazyFileRoute('/app/businesses-rma/rma/$rmaId/delivery/delete-detail/$detailId')({
  component: AppViewRmaViewDeliveryViewDeleteDetailModalView,
});
