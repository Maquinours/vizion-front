import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewRmaViewSupportViewDeleteLinkModalView from '../../../../../../views/App/views/Rma/views/Support/views/DeleteLinkModal/DeleteLinkModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/rma/$rmaId/support/delete-link/$associatedId',
)({
  component: AppViewRmaViewSupportViewDeleteLinkModalView,
})
