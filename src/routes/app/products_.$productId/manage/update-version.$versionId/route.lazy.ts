import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductViewManageViewUpdateVersionModalView from '../../../../../views/App/views/Product/views/Manage/views/UpdateVersionModal/UpdateVersionModal';

export const Route = createLazyFileRoute('/app/products_/$productId/manage/update-version/$versionId')({
  component: AppViewProductViewManageViewUpdateVersionModalView,
});
