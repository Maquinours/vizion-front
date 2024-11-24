import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewAssistanceViewDeleteGedObjectModalView from '../../../../../../views/App/views/Assistance/views/DeleteGedObjectModal/DeleteGedObjectModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId_/assistance/$assistanceId/delete-ged-object/$objectRelativePath')({
  component: AppViewAssistanceViewDeleteGedObjectModalView,
});
