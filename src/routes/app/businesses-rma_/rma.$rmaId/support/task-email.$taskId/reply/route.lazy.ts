import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewRmaViewSupportViewTaskEmailModalViewReplyModalView from '../../../../../../../views/App/views/Rma/views/Support/views/TaskEmailModal/views/ReplyModal/ReplyModal';

export const Route = createLazyFileRoute('/app/businesses-rma/rma/$rmaId/support/task-email/$taskId/reply')({
  component: AppViewRmaViewSupportViewTaskEmailModalViewReplyModalView,
});
