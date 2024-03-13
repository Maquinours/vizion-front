import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewDashboardViewDeleteCollectiveTasksModalView from '../../../../views/App/views/Dashboard/views/DeleteCollectiveTasksModal/DeleteCollectiveTasksModal';

export const Route = createLazyFileRoute('/app/dashboard/delete-collective-tasks')({
  component: AppViewDashboardViewDeleteCollectiveTasksModalView,
});
