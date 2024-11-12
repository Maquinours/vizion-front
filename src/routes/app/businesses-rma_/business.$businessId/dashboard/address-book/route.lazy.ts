import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewDashboardViewAddressBookModalView from '../../../../../../views/App/views/Business/views/Dashboard/views/AddressBookModal/AddressBookModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/dashboard/address-book')({
  component: AppViewBusinessViewDashboardViewAddressBookModalView,
});
