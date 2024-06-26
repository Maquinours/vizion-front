import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterpriseViewDeleteGedObjectModalView from '../../../../../views/App/views/Enterprise/views/DeleteGedObjectModal/DeleteGedObjectModal';

export const Route = createLazyFileRoute('/app/enterprises/$enterpriseId/delete-ged-object/$objectRelativePath')({
  component: AppViewEnterpriseViewDeleteGedObjectModalView,
});
