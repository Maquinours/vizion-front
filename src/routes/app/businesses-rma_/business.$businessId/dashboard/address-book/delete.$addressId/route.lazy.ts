import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewBusinessViewDashboardViewAddressBookModalViewDeleteModalView from '../../../../../../../views/App/views/Business/views/Dashboard/views/AddressBookModal/views/DeleteModal/DeleteModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/business/$businessId/dashboard/address-book/delete/$addressId',
)({
  component:
    AppViewBusinessViewDashboardViewAddressBookModalViewDeleteModalView,
})
