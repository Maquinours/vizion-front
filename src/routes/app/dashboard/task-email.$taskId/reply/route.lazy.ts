import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewDashboardViewTaskEmailModalViewReplyView from '../../../../../views/App/views/Dashboard/views/TaskEmailModal/views/Reply/Reply';

export const Route = createLazyFileRoute('/app/dashboard/task-email/$taskId/reply')({
  component: AppViewDashboardViewTaskEmailModalViewReplyView,
});
