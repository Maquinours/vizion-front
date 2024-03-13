import { createLazyFileRoute } from '@tanstack/react-router';
import DashboardComponentCreateCollectiveTaskModalView from '../../../../views/App/views/Dashboard/views/CreateCollectiveTaskModal/CreateCollectiveTaskModal';

export const Route = createLazyFileRoute('/app/dashboard/create-collective-task')({
  component: DashboardComponentCreateCollectiveTaskModalView,
});
