import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterpriseViewUpdateModalView from '../../../../views/App/views/Enterprise/views/UpdateModal/UpdateModal';

export const Route = createLazyFileRoute('/app/enterprises_/$enterpriseId/update')({
  component: AppViewEnterpriseViewUpdateModalView,
});
