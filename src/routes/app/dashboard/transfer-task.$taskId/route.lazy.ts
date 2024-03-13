import { createFileRoute } from '@tanstack/react-router';
import AppViewDashboardViewTransferTaskModalView from '../../../../views/App/views/Dashboard/views/TransferTaskModal/TransferTaskModal';

export const Route = createFileRoute('/app/dashboard/transfer-task/$taskId')({
  component: AppViewDashboardViewTransferTaskModalView,
});
