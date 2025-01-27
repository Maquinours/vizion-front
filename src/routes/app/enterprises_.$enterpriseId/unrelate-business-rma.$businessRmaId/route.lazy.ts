import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewEnterpriseViewUnrelateBusinessRmaModalView from '../../../../views/App/views/Enterprise/views/UnrelateBusinessRmaModal/UnrelateBusinessRmaModal'

export const Route = createLazyFileRoute(
  '/app/enterprises_/$enterpriseId/unrelate-business-rma/$businessRmaId',
)({
  component: AppViewEnterpriseViewUnrelateBusinessRmaModalView,
})
