import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewRmaViewSupportViewUpdateDetailModalView from '../../../../../../views/App/views/Rma/views/Support/views/UpdateDetailModal/UpdateDetailModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/rma/$rmaId/support/update-detail/$detailId')({
  component: AppViewRmaViewSupportViewUpdateDetailModalView,
});
