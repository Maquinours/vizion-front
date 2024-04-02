import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewSchedulerViewDetailsModalViewUpdateModalView from '../../../../../../views/App/views/Tools/views/Scheduler/views/DetailsModal/views/UpdateModal/UpdateModal';

export const Route = createLazyFileRoute('/app/tools/scheduler/details/$rdvId/update')({
  component: AppViewToolsViewSchedulerViewDetailsModalViewUpdateModalView,
});
