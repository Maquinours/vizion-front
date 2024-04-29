import { createFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewDashboardViewUpdateBillingAddressModalView from '../../../../../../views/App/views/Business/views/Dashboard/views/UpdateBillingAddressModal/UpdateBillingAddressModal';

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/dashboard/update-billing-address')({
  component: AppViewBusinessViewDashboardViewUpdateBillingAddressModalView,
});
