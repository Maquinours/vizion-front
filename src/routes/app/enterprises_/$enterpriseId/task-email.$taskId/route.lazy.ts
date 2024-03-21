import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewDashboardViewTaskEmailModalView from '../../../../../views/App/views/Dashboard/views/TaskEmailModal/TaskEmailModal';

export const Route = createLazyFileRoute('/app/enterprises/$enterpriseId/task-email/$taskId')({
  component: AppViewDashboardViewTaskEmailModalView,
});
