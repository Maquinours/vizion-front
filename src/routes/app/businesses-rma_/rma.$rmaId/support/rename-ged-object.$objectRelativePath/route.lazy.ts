import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewRmaViewSupportViewRenameGedObjectModalView from '../../../../../../views/App/views/Rma/views/Support/views/RenameGedObjectModal/RenameGedObjectModal';

export const Route = createLazyFileRoute('/app/businesses-rma/rma/$rmaId/support/rename-ged-object/$objectRelativePath')({
  component: AppViewRmaViewSupportViewRenameGedObjectModalView,
});
