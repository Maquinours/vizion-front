import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewDashboardViewDeleteProgressiveInfoModalView from '../../../../views/App/views/Dashboard/views/DeleteProgressiveInfoModal/DeleteProgressiveInfoModal';

export const Route = createLazyFileRoute('/app/dashboard/delete-progressive-info/$progressiveInfoId')({
  component: AppViewDashboardViewDeleteProgressiveInfoModalView,
});
