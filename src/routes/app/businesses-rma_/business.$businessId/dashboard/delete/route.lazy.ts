import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewDashboardViewDeleteModalView from '../../../../../../views/App/views/Business/views/Dashboard/views/DeleteModal/DeleteModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/dashboard/delete')({
  component: AppViewBusinessViewDashboardViewDeleteModalView,
});
