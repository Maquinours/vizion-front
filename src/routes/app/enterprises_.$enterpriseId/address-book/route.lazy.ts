import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterpriseViewAddressBookModalView from '../../../../views/App/views/Enterprise/views/AddressBookModal/AddressBookModal';

export const Route = createLazyFileRoute('/app/enterprises/$enterpriseId/address-book')({
  component: AppViewEnterpriseViewAddressBookModalView,
});
