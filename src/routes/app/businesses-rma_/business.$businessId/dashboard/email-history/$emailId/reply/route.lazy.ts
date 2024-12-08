import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewDashboardViewEmailHistoryModalViewEmailModalViewReplyModalView from '../../../../../../../../views/App/views/Business/views/Dashboard/views/MailHistoryModal/EmailModal/ReplyModal/ReplyModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/dashboard/email-history/$emailId/reply')({
  component: AppViewBusinessViewDashboardViewEmailHistoryModalViewEmailModalViewReplyModalView,
});
