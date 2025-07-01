import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewDashboardViewTaskEmailModalViewResendView from '../../../../../views/App/views/Dashboard/views/TaskEmailModal/views/ResendModal/ResendModal';

export const Route = createLazyFileRoute('/app/dashboard/task-email/$taskId/resend')({
  component: AppViewDashboardViewTaskEmailModalViewResendView,
});
