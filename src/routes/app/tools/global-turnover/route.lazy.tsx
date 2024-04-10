import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewGlobalTurnoverView from '../../../../views/App/views/Tools/views/GlobalTurnover/GlobalTurnover';

export const Route = createLazyFileRoute('/app/tools/global-turnover')({
  component: AppViewToolsViewGlobalTurnoverView,
});
