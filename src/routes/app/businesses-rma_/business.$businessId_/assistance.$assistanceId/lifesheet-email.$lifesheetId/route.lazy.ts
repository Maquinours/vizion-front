import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewAssistanceViewLifesheetEmailModalView from '../../../../../../views/App/views/Assistance/views/LifesheetEmailModal/LifesheetEmailModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId_/assistance/$assistanceId/lifesheet-email/$lifesheetId')({
  component: AppViewAssistanceViewLifesheetEmailModalView,
});
