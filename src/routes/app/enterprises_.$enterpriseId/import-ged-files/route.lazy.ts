import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterpriseViewImportGedFilesModalView from '../../../../views/App/views/Enterprise/views/ImportGedFilesModal/ImportGedFilesModal';

export const Route = createLazyFileRoute('/app/enterprises_/$enterpriseId/import-ged-files')({
  component: AppViewEnterpriseViewImportGedFilesModalView,
});
