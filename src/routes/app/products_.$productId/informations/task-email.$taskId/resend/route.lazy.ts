import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductViewInformationsViewTaskEmailModalViewResendModalView from '../../../../../../views/App/views/Product/views/Informations/views/TaskEmailModal/views/ResendModal/ResendModal';

export const Route = createLazyFileRoute('/app/products_/$productId/informations/task-email/$taskId/resend')({
  component: AppViewProductViewInformationsViewTaskEmailModalViewResendModalView,
});
