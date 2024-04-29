import { createFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewDashboardViewUpdateResponsibleModalView from '../../../../../../views/App/views/Business/views/Dashboard/views/UpdateResponsibleModal/UpdateResponsibleModal';

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/dashboard/update-responsible')({
  component: AppViewBusinessViewDashboardViewUpdateResponsibleModalView,
});
