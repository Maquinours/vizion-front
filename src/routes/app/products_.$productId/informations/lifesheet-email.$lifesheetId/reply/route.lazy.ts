import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductViewInformationsViewLifesheetEmailModalViewReplyModalView from '../../../../../../views/App/views/Product/views/Informations/views/LifesheetEmailModal/views/ReplyModal/ReplyModal';

export const Route = createLazyFileRoute('/app/products_/$productId/informations/lifesheet-email/$lifesheetId/reply')({
  component: AppViewProductViewInformationsViewLifesheetEmailModalViewReplyModalView,
});
