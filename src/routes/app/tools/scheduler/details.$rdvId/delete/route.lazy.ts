import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewSchedulerViewDetailsModalViewDeleteModalView from '../../../../../../views/App/views/Tools/views/Scheduler/views/DetailsModal/views/DeleteModal/DeleteModal';

export const Route = createLazyFileRoute('/app/tools/scheduler/details/$rdvId/delete')({
  component: AppViewToolsViewSchedulerViewDetailsModalViewDeleteModalView,
});
