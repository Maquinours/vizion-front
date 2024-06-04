import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewRmaViewSupportViewCreateGedDirectoryModalView from '../../../../../../views/App/views/Rma/views/Support/views/CreateGedDirectoryModal/CreateGedDirectoryModal';

export const Route = createLazyFileRoute('/app/businesses-rma/rma/$rmaId/support/create-ged-directory')({
  component: AppViewRmaViewSupportViewCreateGedDirectoryModalView,
});
