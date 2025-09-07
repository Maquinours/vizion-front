import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterpriseViewDeleteLifesheetModalView from '../../../../views/App/views/Enterprise/views/DeleteLifesheetModal/DeleteLifesheetModal';

export const Route = createLazyFileRoute('/app/enterprises_/$enterpriseId/delete-lifesheet/$lifesheetId')({
  component: AppViewEnterpriseViewDeleteLifesheetModalView,
});
