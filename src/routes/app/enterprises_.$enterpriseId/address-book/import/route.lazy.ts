import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterpriseViewAddressBookModalViewImportModalView from '../../../../../views/App/views/Enterprise/views/AddressBookModal/views/ImportModal/ImportModal';

export const Route = createLazyFileRoute('/app/enterprises/$enterpriseId/address-book/import')({
  component: AppViewEnterpriseViewAddressBookModalViewImportModalView,
});
