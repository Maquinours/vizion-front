import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewDashboardViewTaskCommentsModalView from '../../../../views/App/views/Dashboard/views/TaskCommentsModal/TaskCommentsModal';

export const Route = createLazyFileRoute('/app/dashboard/task-comments/$taskId')({
  component: AppViewDashboardViewTaskCommentsModalView,
});
