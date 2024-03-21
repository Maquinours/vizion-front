import { createLazyFileRoute } from '@tanstack/react-router';
import AppRouteAppEnterpriseViewCreateGedDirectoryModalView from '../../../../../views/App/views/Enterprise/views/CreateGedDirectoryModal/CreateGedDirectoryModal';

export const Route = createLazyFileRoute('/app/enterprises/$enterpriseId/create-ged-directory')({
  component: AppRouteAppEnterpriseViewCreateGedDirectoryModalView,
});
