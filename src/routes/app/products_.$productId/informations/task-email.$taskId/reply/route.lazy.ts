import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductViewInformationsViewTaskEmailModalViewReplyModalView from '../../../../../../views/App/views/Product/views/Informations/views/TaskEmailModal/views/ReplyModal/ReplyModal';

export const Route = createLazyFileRoute('/app/products/$productId/informations/task-email/$taskId/reply')({
  component: AppViewProductViewInformationsViewTaskEmailModalViewReplyModalView,
});
