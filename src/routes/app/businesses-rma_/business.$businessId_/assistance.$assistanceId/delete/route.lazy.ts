import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewAssistanceViewDeleteModalView from '../../../../../../views/App/views/Assistance/views/DeleteModal/DeleteModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId_/assistance/$assistanceId/delete')({
  component: AppViewAssistanceViewDeleteModalView,
});
