import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewDashboardViewCreateAircallContactModalView from '../../../../views/App/views/Dashboard/views/CreateAircallContactModal/CreateAircallContactModal';

export const Route = createLazyFileRoute('/app/dashboard/create-aircall-contact/$number')({
  component: AppViewDashboardViewCreateAircallContactModalView,
});
