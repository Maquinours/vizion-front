import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewAssistanceViewDeleteLifesheetModalView from '../../../../../../views/App/views/Assistance/views/DeleteLifesheetModal/DeleteLifesheetModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId_/assistance/$assistanceId/delete-lifesheet/$lifesheetId')({
  component: AppViewAssistanceViewDeleteLifesheetModalView,
});
