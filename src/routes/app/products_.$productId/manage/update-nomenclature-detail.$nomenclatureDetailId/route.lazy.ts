import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductViewManageViewUpdateNomenclatureDetailModalView from '../../../../../views/App/views/Product/views/Manage/views/UpdateNomenclatureDetailModal/UpdateNomenclatureDetailModal';

export const Route = createLazyFileRoute('/app/products/$productId/manage/update-nomenclature-detail/$nomenclatureDetailId')({
  component: AppViewProductViewManageViewUpdateNomenclatureDetailModalView,
});
