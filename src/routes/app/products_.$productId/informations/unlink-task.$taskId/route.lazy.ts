import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductViewInformationsViewUnlinkTaskModalView from '../../../../../views/App/views/Product/views/Informations/views/UnlinkTaskModal/UnlinkTaskModal';

export const Route = createLazyFileRoute('/app/products_/$productId/informations/unlink-task/$taskId')({
  component: AppViewProductViewInformationsViewUnlinkTaskModalView,
});
