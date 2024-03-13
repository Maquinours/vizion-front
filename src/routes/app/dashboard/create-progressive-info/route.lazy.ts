import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewDashboardViewCreateProgressiveInfoModalView from '../../../../views/App/views/Dashboard/views/CreateProgressiveInfoModal/CreateProgressiveInfoModal';

export const Route = createLazyFileRoute('/app/dashboard/create-progressive-info')({
  component: AppViewDashboardViewCreateProgressiveInfoModalView,
});
