import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterpriseViewTaskEmailModalViewReplyModalView from '../../../../../views/App/views/Enterprise/views/TaskEmailModal/views/ReplyModal/ReplyModal';

export const Route = createLazyFileRoute('/app/enterprises_/$enterpriseId/task-email/$taskId/reply')({
  component: AppViewEnterpriseViewTaskEmailModalViewReplyModalView,
});
