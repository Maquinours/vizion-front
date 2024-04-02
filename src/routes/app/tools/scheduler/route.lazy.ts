import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewSchedulerView from '../../../../views/App/views/Tools/views/Scheduler/Scheduler';

export const Route = createLazyFileRoute('/app/tools/scheduler')({
  component: AppViewToolsViewSchedulerView,
});
