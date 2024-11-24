import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewRmaViewSupportViewCreateDetailModalView from '../../../../../../views/App/views/Rma/views/Support/views/CreateDetailModal/CreateDetailModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/rma/$rmaId/support/create-detail')({
  component: AppViewRmaViewSupportViewCreateDetailModalView,
});
