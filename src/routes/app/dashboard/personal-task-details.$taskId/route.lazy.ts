import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewDashboardViewPersonalTaskDetailsModalView from '../../../../views/App/views/Dashboard/views/PersonalTaskDetailsModal/PersonalTaskDetailsModal';

export const Route = createLazyFileRoute('/app/dashboard/personal-task-details/$taskId')({
  component: AppViewDashboardViewPersonalTaskDetailsModalView,
});
