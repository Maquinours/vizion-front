import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewRmaViewSupportViewDeleteGedObjectModalView from '../../../../../../views/App/views/Rma/views/Support/views/DeleteGedObjectModal/DeleteGedObjectModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/rma/$rmaId/support/delete-ged-object/$relativePath')({
  component: AppViewRmaViewSupportViewDeleteGedObjectModalView,
});
