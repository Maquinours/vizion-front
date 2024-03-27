import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductViewInformationsViewCreateLifesheetCommentModalView from '../../../../../views/App/views/Product/views/Informations/views/CreateLifesheetCommentModal/CreateLifesheetCommentModal';

export const Route = createLazyFileRoute('/app/products/$productId/informations/create-lifesheet-comment')({
  component: AppViewProductViewInformationsViewCreateLifesheetCommentModalView,
});
