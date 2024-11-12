import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewRmaViewReceptionViewUpdateDetailModalView from '../../../../../../views/App/views/Rma/views/Reception/views/UpdateDetailModal/UpdateDetailModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/rma/$rmaId/reception/update-detail/$detailId')({
  component: AppViewRmaViewReceptionViewUpdateDetailModalView,
});
