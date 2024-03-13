import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewDashboardViewCreatePersonalTaskModalView from '../../../../views/App/views/Dashboard/views/CreatePersonalTaskModal/CreatePersonalTaskModal';

export const Route = createLazyFileRoute('/app/dashboard/create-personal-task')({
  component: AppViewDashboardViewCreatePersonalTaskModalView,
});
