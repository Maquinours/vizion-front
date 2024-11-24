import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductViewInformationsViewTaskEmailModalView from '../../../../../views/App/views/Product/views/Informations/views/TaskEmailModal/TaskEmailModal';

export const Route = createLazyFileRoute('/app/products_/$productId/informations/task-email/$taskId')({
  component: AppViewProductViewInformationsViewTaskEmailModalView,
});
