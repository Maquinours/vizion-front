import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewAssistanceViewEditNoBilledTimeModalView from '../../../../../../views/App/views/Assistance/views/EditNoBilledTimeModal/EditNoBilledTimeModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/business/$businessId_/assistance/$assistanceId/edit-no-billed-time',
)({
  component: AppViewAssistanceViewEditNoBilledTimeModalView,
})
