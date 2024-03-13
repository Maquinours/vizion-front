import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewDashboardViewTakeCollectiveTaskModalView from '../../../../views/App/views/Dashboard/views/TakeCollectiveTaskModal/TakeCollectiveTaskModal';

export const Route = createLazyFileRoute('/app/dashboard/take-collective-task/$taskId')({
  component: AppViewDashboardViewTakeCollectiveTaskModalView,
});
