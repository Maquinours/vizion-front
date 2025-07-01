import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewDashboardViewTaskEmailModalViewResendModalView from '../../../../../../../views/App/views/Business/views/Dashboard/views/TaskEmailModal/views/ResendModal/ResendModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/dashboard/task-email/$taskId/resend')({
  component: AppViewBusinessViewDashboardViewTaskEmailModalViewResendModalView,
});
