import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewRmaViewReceptionViewDeleteDetailModalView from '../../../../../../views/App/views/Rma/views/Reception/views/DeleteDetailModal/DeleteDetailModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/rma/$rmaId/reception/delete-detail/$detailId',
)({
  component: AppViewRmaViewReceptionViewDeleteDetailModalView,
})
