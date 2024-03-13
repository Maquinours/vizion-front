import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewDashboardView from '../../../views/App/views/Dashboard/Dashboard';

export const Route = createLazyFileRoute('/app/dashboard')({
  component: AppViewDashboardView,
});
