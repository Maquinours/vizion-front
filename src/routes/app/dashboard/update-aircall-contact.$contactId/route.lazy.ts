import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewDashboardViewUpdateAircallContactModalView from '../../../../views/App/views/Dashboard/views/UpdateAircallContactModal/UpdateAircallContactModal';

export const Route = createLazyFileRoute('/app/dashboard/update-aircall-contact/$contactId')({
  component: AppViewDashboardViewUpdateAircallContactModalView,
});
