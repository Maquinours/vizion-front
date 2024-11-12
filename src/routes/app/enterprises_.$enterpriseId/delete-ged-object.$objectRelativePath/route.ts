import { createFileRoute } from '@tanstack/react-router'
import LoaderModal from '../../../../components/LoaderModal/LoaderModal'

export const Route = createFileRoute(
  '/app/enterprises_/$enterpriseId/delete-ged-object/$objectRelativePath',
)({
  pendingComponent: LoaderModal,
})
