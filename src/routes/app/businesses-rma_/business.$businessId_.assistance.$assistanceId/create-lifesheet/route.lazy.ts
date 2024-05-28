import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewAssistanceViewCreateLifesheetModalView from '../../../../../views/App/views/Assistance/views/CreateLifesheetModal/CreateLifesheetModal';

export const Route = createLazyFileRoute('/app/businesses-rma/business/$businessId/assistance/$assistanceId/create-lifesheet')({
  component: AppViewAssistanceViewCreateLifesheetModalView,
});
