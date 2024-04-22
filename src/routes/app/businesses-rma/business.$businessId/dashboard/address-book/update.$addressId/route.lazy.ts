import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewDashboardViewAddressBookModalViewUpdateModalView from '../../../../../../../views/App/views/Business/views/Dashboard/views/AddressBookModal/views/UpdateModal/UpdateModal';

export const Route = createLazyFileRoute('/app/businesses-rma/business/$businessId/dashboard/address-book/update/$addressId')({
  component: AppViewBusinessViewDashboardViewAddressBookModalViewUpdateModalView,
});
