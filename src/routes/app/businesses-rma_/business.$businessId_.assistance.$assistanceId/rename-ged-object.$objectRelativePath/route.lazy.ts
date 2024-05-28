import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewAssistanceViewRenameGedObjectModalView from '../../../../../views/App/views/Assistance/views/RenameGedObjectModal/RenameGedObjectModal';

export const Route = createLazyFileRoute('/app/businesses-rma/business/$businessId/assistance/$assistanceId/rename-ged-object/$objectRelativePath')({
  component: AppViewAssistanceViewRenameGedObjectModalView,
});
