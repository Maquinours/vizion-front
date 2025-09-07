import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewDashboardViewDeleteLifesheetModalView from '../../../../../../views/App/views/Business/views/Dashboard/views/DeleteLifesheetModal/DeleteLifesheetModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/dashboard/delete-lifesheet/$lifesheetId')({
  component: AppViewBusinessViewDashboardViewDeleteLifesheetModalView,
});
