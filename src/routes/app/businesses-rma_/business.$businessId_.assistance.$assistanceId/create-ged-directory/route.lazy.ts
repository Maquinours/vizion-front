import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewAssistanceViewCreateGedDirectoryModalView from '../../../../../views/App/views/Assistance/views/CreateGedDirectoryModal/CreateGedDirectoryModal';

export const Route = createLazyFileRoute('/app/businesses-rma/business/$businessId/assistance/$assistanceId/create-ged-directory')({
  component: AppViewAssistanceViewCreateGedDirectoryModalView,
});
