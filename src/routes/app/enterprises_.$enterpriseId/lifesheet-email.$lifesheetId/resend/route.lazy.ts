import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterpriseViewLifesheetEmailModalViewResendModalView from '../../../../../views/App/views/Enterprise/views/LifesheetEmailModal/views/ResendModal/ResendModal';

export const Route = createLazyFileRoute('/app/enterprises_/$enterpriseId/lifesheet-email/$lifesheetId/resend')({
  component: AppViewEnterpriseViewLifesheetEmailModalViewResendModalView,
});
