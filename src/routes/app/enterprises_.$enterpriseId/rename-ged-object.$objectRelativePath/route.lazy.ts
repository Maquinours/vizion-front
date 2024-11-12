import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewEnterpriseViewRenameGedObjectModalView from '../../../../views/App/views/Enterprise/views/RenameGedObjectModal/RenameGedObjectModal'

export const Route = createLazyFileRoute(
  '/app/enterprises_/$enterpriseId/rename-ged-object/$objectRelativePath',
)({
  component: AppViewEnterpriseViewRenameGedObjectModalView,
})
