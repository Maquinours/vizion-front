import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewDashboardViewTransferTaskModalView from '../../../../views/App/views/Dashboard/views/TransferTaskModal/TransferTaskModal';

export const Route = createLazyFileRoute('/app/dashboard/transfer-task/$taskId')({
  component: AppViewDashboardViewTransferTaskModalView,
});
