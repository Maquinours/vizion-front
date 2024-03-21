import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterpriseViewAddressBookModalViewDeleteModalView from '../../../../../../views/App/views/Enterprise/views/AddressBookModal/views/DeleteModal/DeleteModal';

export const Route = createLazyFileRoute('/app/enterprises/$enterpriseId/address-book/delete/$addressId')({
  component: AppViewEnterpriseViewAddressBookModalViewDeleteModalView,
});
