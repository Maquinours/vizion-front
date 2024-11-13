import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewDashboardViewAddressBookModalViewCreateModalView from '../../../../../../../views/App/views/Business/views/Dashboard/views/AddressBookModal/views/CreateModal/CreateModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/dashboard/address-book/create')({
  component: AppViewBusinessViewDashboardViewAddressBookModalViewCreateModalView,
});
