import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewEnterpriseViewAddressBookModalViewCreateModalView from '../../../../../views/App/views/Enterprise/views/AddressBookModal/views/CreateModal/CreateModal'

export const Route = createLazyFileRoute(
  '/app/enterprises_/$enterpriseId/address-book/create',
)({
  component: AppViewEnterpriseViewAddressBookModalViewCreateModalView,
})
