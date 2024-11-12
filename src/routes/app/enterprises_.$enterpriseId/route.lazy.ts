import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewEnterpriseView from '../../../views/App/views/Enterprise/Enterprise'

export const Route = createLazyFileRoute('/app/enterprises_/$enterpriseId')({
  component: AppViewEnterpriseView,
})
