import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewDashboardViewUpdateRepresentativeModalView from '../../../../../../views/App/views/Business/views/Dashboard/views/UpdateRepresentativeModal/UpdateRepresentativeModal';

export const Route = createLazyFileRoute('/app/businesses-rma/business/$businessId/dashboard/update-representative')({
  component: AppViewBusinessViewDashboardViewUpdateRepresentativeModalView,
});
