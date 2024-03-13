import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewDashboardViewOtherPersonalTasksModalView from '../../../../views/App/views/Dashboard/views/OtherPersonalTasksModal/OtherPersonalTasksModal';

export const Route = createLazyFileRoute('/app/dashboard/other-personal-tasks/$profileId')({
  component: AppViewDashboardViewOtherPersonalTasksModalView,
});
