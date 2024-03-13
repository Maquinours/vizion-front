import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewDashboardViewDeleteCollectiveTaskModal from '../../../../views/App/views/Dashboard/views/DeleteCollectiveTaskModal/DeleteCollectiveTaskModal';

export const Route = createLazyFileRoute('/app/dashboard/delete-collective-task/$taskId')({
  component: AppViewDashboardViewDeleteCollectiveTaskModal,
});
