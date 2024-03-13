import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewDashboardViewArchivePersonalTaskModalView from '../../../../views/App/views/Dashboard/views/ArchivePersonalTaskModal/ArchivePersonalTaskModal';

export const Route = createLazyFileRoute('/app/dashboard/archive-personal-task/$taskId')({
  component: AppViewDashboardViewArchivePersonalTaskModalView,
});
