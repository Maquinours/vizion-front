import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewAssistanceViewEditCumulatedTimeModalView from '../../../../../../views/App/views/Assistance/views/EditCumulatedTimeModal/EditCumulatedTimeModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/business/$businessId_/assistance/$assistanceId/edit-cumulated-time',
)({
  component: AppViewAssistanceViewEditCumulatedTimeModalView,
})
