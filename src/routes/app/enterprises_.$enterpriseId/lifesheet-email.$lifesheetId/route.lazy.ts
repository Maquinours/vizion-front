import { createLazyFileRoute } from '@tanstack/react-router';
import appViewEnterpriseViewLifesheetEmailModalView from '../../../../views/App/views/Enterprise/views/LifesheetEmailModal/LifesheetEmailModal';

export const Route = createLazyFileRoute('/app/enterprises/$enterpriseId/lifesheet-email/$lifesheetId')({
  component: appViewEnterpriseViewLifesheetEmailModalView,
});
