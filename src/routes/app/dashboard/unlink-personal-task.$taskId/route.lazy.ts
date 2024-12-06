import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewDashboardViewUnlinkPersonalTaskModalView from '../../../../views/App/views/Dashboard/views/UnlinkPersonalTaskModal/UnlinkPersonalTaskModal';

export const Route = createLazyFileRoute('/app/dashboard/unlink-personal-task/$taskId')({
  component: AppViewDashboardViewUnlinkPersonalTaskModalView,
});
