import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewDashboardViewSchedulerEventDetailsModalView from '../../../../views/App/views/Dashboard/views/SchedulerEventDetailsModal/SchedulerEventDetailsModal';

export const Route = createLazyFileRoute('/app/dashboard/scheduler-event-details/$eventId')({
  component: AppViewDashboardViewSchedulerEventDetailsModalView,
});
