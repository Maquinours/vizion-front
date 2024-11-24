import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewAssistanceViewCreateGedDirectoryModalView from '../../../../../../views/App/views/Assistance/views/CreateGedDirectoryModal/CreateGedDirectoryModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId_/assistance/$assistanceId/create-ged-directory')({
  component: AppViewAssistanceViewCreateGedDirectoryModalView,
});
