import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewRmaViewReceptionViewCreateDetailModalView from '../../../../../../views/App/views/Rma/views/Reception/views/CreateDetailModal/CreateDetailModal';

export const Route = createLazyFileRoute('/app/businesses-rma/rma/$rmaId/reception/create-detail')({
  component: AppViewRmaViewReceptionViewCreateDetailModalView,
});
