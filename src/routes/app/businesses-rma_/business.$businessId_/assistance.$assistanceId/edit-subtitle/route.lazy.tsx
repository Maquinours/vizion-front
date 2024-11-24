import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewAssistanceViewEditSubtitleModalView from '../../../../../../views/App/views/Assistance/views/EditSubtitlteModal/EditSubtitleModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId_/assistance/$assistanceId/edit-subtitle')({
  component: AppViewAssistanceViewEditSubtitleModalView,
});
