import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewBpViewCreateDetailRmaModalView from '../../../../../../views/App/views/Business/views/Bp/views/CreateDetailRmaModal/CreateDetailRmaModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/bp/create-detail-rma/$detailId')({
  component: AppViewBusinessViewBpViewCreateDetailRmaModalView,
});
