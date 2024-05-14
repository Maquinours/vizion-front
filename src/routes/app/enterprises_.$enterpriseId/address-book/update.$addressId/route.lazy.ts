import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterpriseViewAddressBookModalViewUpdateModalView from '../../../../../views/App/views/Enterprise/views/AddressBookModal/views/UpdateModal/UpdateModal';

export const Route = createLazyFileRoute('/app/enterprises/$enterpriseId/address-book/update/$addressId')({
  component: AppViewEnterpriseViewAddressBookModalViewUpdateModalView,
});
