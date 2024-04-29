import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewDashboardViewTaskEmailModalView from '../../../../../../views/App/views/Business/views/Dashboard/views/TaskEmailModal/TaskEmailModal';

export const Route = createLazyFileRoute('/app/businesses-rma/business/$businessId/dashboard/task-email/$taskId')({
  component: AppViewBusinessViewDashboardViewTaskEmailModalView,
});
