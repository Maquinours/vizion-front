import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductViewManageViewCreateVersionModalView from '../../../../../views/App/views/Product/views/Manage/views/CreateVersionModal/CreateVersionModal';

export const Route = createLazyFileRoute('/app/products_/$productId/manage/create-version')({
  component: AppViewProductViewManageViewCreateVersionModalView,
});
