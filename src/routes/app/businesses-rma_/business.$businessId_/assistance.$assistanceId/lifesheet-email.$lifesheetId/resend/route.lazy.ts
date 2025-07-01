import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewAssistanceViewLifesheetEmailModalViewResendModalView from '../../../../../../../views/App/views/Assistance/views/LifesheetEmailModal/views/ResendModal/ResendModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId_/assistance/$assistanceId/lifesheet-email/$lifesheetId/resend')({
  component: AppViewAssistanceViewLifesheetEmailModalViewResendModalView,
});
