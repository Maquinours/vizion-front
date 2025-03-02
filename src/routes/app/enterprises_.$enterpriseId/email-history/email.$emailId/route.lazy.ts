import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterpriseViewEmailHistoryModalViewEmailModalView from '../../../../../views/App/views/Enterprise/views/EmailHistoryModal/views/EmailModal/EmailModal';

export const Route = createLazyFileRoute('/app/enterprises_/$enterpriseId/email-history/email/$emailId')({
  component: AppViewEnterpriseViewEmailHistoryModalViewEmailModalView,
});
