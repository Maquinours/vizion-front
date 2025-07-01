import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterpriseViewTaskEmailModalViewResendModalView from '../../../../../views/App/views/Enterprise/views/TaskEmailModal/views/ResendModal/ResendModal';

export const Route = createLazyFileRoute('/app/enterprises_/$enterpriseId/task-email/$taskId/resend')({
  component: AppViewEnterpriseViewTaskEmailModalViewResendModalView,
});
