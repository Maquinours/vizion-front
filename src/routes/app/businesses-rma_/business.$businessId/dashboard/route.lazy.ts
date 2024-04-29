import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewDashboardView from '../../../../../views/App/views/Business/views/Dashboard/Dashboard';

export const Route = createLazyFileRoute('/app/businesses-rma/business/$businessId/dashboard')({
  component: AppViewBusinessViewDashboardView,
});
