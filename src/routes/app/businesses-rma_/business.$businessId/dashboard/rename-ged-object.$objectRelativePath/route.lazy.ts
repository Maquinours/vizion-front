import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewDashboardViewRenameGedObjectModalView from '../../../../../../views/App/views/Business/views/Dashboard/views/RenameGedObjectModal/RenameGedObjectModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/dashboard/rename-ged-object/$objectRelativePath')({
  component: AppViewBusinessViewDashboardViewRenameGedObjectModalView,
});
