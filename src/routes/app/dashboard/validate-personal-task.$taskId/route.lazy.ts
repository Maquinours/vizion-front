import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewDashboardViewValidatePersonalTaskModalView from '../../../../views/App/views/Dashboard/views/ValidatePersonalTaskModal/ValidatePersonalTaskModal';

export const Route = createLazyFileRoute('/app/dashboard/validate-personal-task/$taskId')({
  component: AppViewDashboardViewValidatePersonalTaskModalView,
});
