import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewSchedulerViewDetailsModalView from '../../../../../views/App/views/Tools/views/Scheduler/views/DetailsModal/DetailsModal';

export const Route = createLazyFileRoute('/app/tools/scheduler/details/$rdvId')({
  component: AppViewToolsViewSchedulerViewDetailsModalView,
});
