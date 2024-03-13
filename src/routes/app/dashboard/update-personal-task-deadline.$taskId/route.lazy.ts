import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewDashboardViewUpdatePersonalTaskDeadline from '../../../../views/App/views/Dashboard/views/UpdatePersonalTaskDeadline/UpdatePersonalTaskDeadline';

export const Route = createLazyFileRoute('/app/dashboard/update-personal-task-deadline/$taskId')({
  component: AppViewDashboardViewUpdatePersonalTaskDeadline,
});
