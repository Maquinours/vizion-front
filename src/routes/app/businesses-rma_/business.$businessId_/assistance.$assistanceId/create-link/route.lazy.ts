import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewAssistanceViewCreateLinkModalComponent from '../../../../../../views/App/views/Assistance/views/CreateLinkModal/CreateLinkModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId_/assistance/$assistanceId/create-link')({
  component: AppViewAssistanceViewCreateLinkModalComponent,
});
