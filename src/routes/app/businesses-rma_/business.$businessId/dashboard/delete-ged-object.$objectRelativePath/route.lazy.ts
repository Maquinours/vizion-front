import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewDashboardViewDeleteGedObjectModalView from '../../../../../../views/App/views/Business/views/Dashboard/views/DeleteGedObjectModal/DeleteGedObjectModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/dashboard/delete-ged-object/$objectRelativePath')({
  component: AppViewBusinessViewDashboardViewDeleteGedObjectModalView,
});
