import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewRmaViewSupportViewDeleteDetailModalView from '../../../../../../views/App/views/Rma/views/Support/views/DeleteDetailModal/DeleteDetailModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/rma/$rmaId/support/delete-detail/$detailId')({
  component: AppViewRmaViewSupportViewDeleteDetailModalView,
});
