import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewDashboardViewTaskEmailModalView from '../../../../views/App/views/Dashboard/views/TaskEmailModal/TaskEmailModal';

export const Route = createLazyFileRoute('/app/dashboard/task-email/$taskId')({
  component: AppViewDashboardViewTaskEmailModalView,
});
