import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterpriseViewLifesheetEmailModalView from '../../../../views/App/views/Enterprise/views/LifesheetEmailModal/LifesheetEmailModal';

export const Route = createLazyFileRoute('/app/enterprises_/$enterpriseId/lifesheet-email/$lifesheetId')({
  component: AppViewEnterpriseViewLifesheetEmailModalView,
});
