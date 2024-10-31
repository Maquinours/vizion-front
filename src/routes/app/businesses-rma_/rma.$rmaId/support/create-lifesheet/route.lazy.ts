import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewRmaViewSupportViewCreateLifesheetModalView from '../../../../../../views/App/views/Rma/views/Support/views/CreateLifesheetModal/CreateLifesheetModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/rma/$rmaId/support/create-lifesheet',
)({
  component: AppViewRmaViewSupportViewCreateLifesheetModalView,
})
