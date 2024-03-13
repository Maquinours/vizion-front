import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewDashboardViewLinkPersonalTaskModalView from '../../../../views/App/views/Dashboard/views/LinkPersonalTaskModal/LinkPersonalTaskModal';

export const Route = createLazyFileRoute('/app/dashboard/link-personal-task/$taskId')({
  component: AppViewDashboardViewLinkPersonalTaskModalView,
});
