import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewAssistanceViewLifesheetEmailModalViewReplyModalView from '../../../../../../../views/App/views/Assistance/views/LifesheetEmailModal/views/ReplyModal/ReplyModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId_/assistance/$assistanceId/lifesheet-email/$lifesheetId/reply')({
  component: AppViewAssistanceViewLifesheetEmailModalViewReplyModalView,
});
