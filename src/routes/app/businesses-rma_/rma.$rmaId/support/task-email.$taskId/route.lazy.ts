import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewRmaViewSupportViewTaskEmailModalView from '../../../../../../views/App/views/Rma/views/Support/views/TaskEmailModal/TaskEmailModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/rma/$rmaId/support/task-email/$taskId')({
  component: AppViewRmaViewSupportViewTaskEmailModalView,
});
