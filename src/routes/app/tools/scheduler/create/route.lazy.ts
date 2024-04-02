import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewSchedulerViewCreateModalView from '../../../../../views/App/views/Tools/views/Scheduler/views/CreateModal/CreateModal';

export const Route = createLazyFileRoute('/app/tools/scheduler/create')({
  component: AppViewToolsViewSchedulerViewCreateModalView,
});
