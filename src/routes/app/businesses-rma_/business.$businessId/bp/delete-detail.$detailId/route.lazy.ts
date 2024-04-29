import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewBpViewDeleteDetailModalView from '../../../../../../views/App/views/Business/views/Bp/views/DeleteDetailModal/DeleteDetailModal';

export const Route = createLazyFileRoute('/app/businesses-rma/business/$businessId/bp/delete-detail/$detailId')({
  component: AppViewBusinessViewBpViewDeleteDetailModalView,
});
