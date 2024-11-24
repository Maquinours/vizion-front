import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewDashboardViewCreateGedDirectoryModalView from '../../../../../../views/App/views/Business/views/Dashboard/views/CreateGedDirectoryModal/CreateGedDirectoryModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/dashboard/create-ged-directory')({
  component: AppViewBusinessViewDashboardViewCreateGedDirectoryModalView,
});
