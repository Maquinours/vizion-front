import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewRmaViewSupportViewTaskEmailModalViewResendModalView from '../../../../../../../views/App/views/Rma/views/Support/views/TaskEmailModal/views/ResendModal/ResendModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/rma/$rmaId/support/task-email/$taskId/resend')({
  component: AppViewRmaViewSupportViewTaskEmailModalViewResendModalView,
});
