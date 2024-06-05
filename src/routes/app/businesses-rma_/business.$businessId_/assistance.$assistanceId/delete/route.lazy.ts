import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewAssistanceViewDeleteModalView from '../../../../../../views/App/views/Assistance/views/DeleteModal/DeleteModal';

export const Route = createLazyFileRoute('/app/businesses-rma/business/$businessId/assistance/$assistanceId/delete')({
  component: AppViewAssistanceViewDeleteModalView,
});
