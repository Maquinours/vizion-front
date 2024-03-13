import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewDashboardViewUpdateProgressiveInfoModalView from '../../../../views/App/views/Dashboard/views/UpdateProgressiveInfoModal/UpdateProgressiveInfoModal';

export const Route = createLazyFileRoute('/app/dashboard/update-progressive-info/$progressiveInfoId')({
  component: AppViewDashboardViewUpdateProgressiveInfoModalView,
});
