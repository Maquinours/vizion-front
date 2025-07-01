import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterpriseViewEmailHistoryModalViewEmailModalViewResendModalView from '../../../../../../views/App/views/Enterprise/views/EmailHistoryModal/views/EmailModal/views/ResendModal/ResendModal';

export const Route = createLazyFileRoute('/app/enterprises_/$enterpriseId/email-history/email/$emailId/resend')({
  component: AppViewEnterpriseViewEmailHistoryModalViewEmailModalViewResendModalView,
});
