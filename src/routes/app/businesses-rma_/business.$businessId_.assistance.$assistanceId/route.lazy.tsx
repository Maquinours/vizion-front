import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewAssistanceView from '../../../../views/App/views/Assistance/Assistance';

export const Route = createLazyFileRoute('/app/businesses-rma/business/$businessId/assistance/$assistanceId')({
  component: AppViewAssistanceView,
});
