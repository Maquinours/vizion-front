import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewAssistanceViewDeleteLinkModalView from '../../../../../../views/App/views/Assistance/views/DeleteLinkModal/DeleteLinkModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId_/assistance/$assistanceId/delete-link/$associatedId')({
  component: AppViewAssistanceViewDeleteLinkModalView,
});
