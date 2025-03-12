import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterpriseViewEmailHistoryModalView from '../../../../views/App/views/Enterprise/views/EmailHistoryModal/EmailHistoryModal';

export const Route = createLazyFileRoute('/app/enterprises_/$enterpriseId/email-history')({
  component: AppViewEnterpriseViewEmailHistoryModalView,
});
