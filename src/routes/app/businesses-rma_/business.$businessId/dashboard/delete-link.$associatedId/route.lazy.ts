import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewDashboardViewDeleteLinkModalView from '../../../../../../views/App/views/Business/views/Dashboard/views/DeleteLinkModal/DeleteLinkModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/dashboard/delete-link/$associatedId')({
  component: AppViewBusinessViewDashboardViewDeleteLinkModalView,
});
