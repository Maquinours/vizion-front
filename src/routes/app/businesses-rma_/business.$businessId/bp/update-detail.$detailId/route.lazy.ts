import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewBpViewUpdateDetailModalView from '../../../../../../views/App/views/Business/views/Bp/views/UpdateDetailModal/UpdateDetailModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/bp/update-detail/$detailId')({
  component: AppViewBusinessViewBpViewUpdateDetailModalView,
});
