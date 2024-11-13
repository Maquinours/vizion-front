import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewDashboardViewImportGedFilesModalView from '../../../../../../views/App/views/Business/views/Dashboard/views/ImportGedFilesModal/ImportGedFilesModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/dashboard/import-ged-files')({
  component: AppViewBusinessViewDashboardViewImportGedFilesModalView,
});
