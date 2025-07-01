import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewDashboardViewTaskEmailModalViewReplyModalView from '../../../../../../../views/App/views/Business/views/Dashboard/views/TaskEmailModal/views/ReplyModal/ReplyModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/dashboard/task-email/$taskId/reply')({
  component: AppViewBusinessViewDashboardViewTaskEmailModalViewReplyModalView,
});
