import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewStudyViewAutomaticView from '../../../../../../views/App/views/Study/views/Automatic/Automatic'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/business/$businessId_/study/automatic',
)({
  component: AppViewStudyViewAutomaticView,
})
