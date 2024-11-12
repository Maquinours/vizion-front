import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewDashboardViewUnlinkTaskModalView from '../../../../../../views/App/views/Business/views/Dashboard/views/UnlinkTaskModal/UnlinkTaskModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/dashboard/unlink-task/$taskId')({
  component: AppViewBusinessViewDashboardViewUnlinkTaskModalView,
});
