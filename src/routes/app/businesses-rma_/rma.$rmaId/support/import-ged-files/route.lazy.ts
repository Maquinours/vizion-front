import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewRmaViewSupportViewImportGedFilesModalView from '../../../../../../views/App/views/Rma/views/Support/views/ImportGedFilesModal/ImportGedFilesModal';

export const Route = createLazyFileRoute('/app/businesses-rma/rma/$rmaId/support/import-ged-files')({
  component: AppViewRmaViewSupportViewImportGedFilesModalView,
});
