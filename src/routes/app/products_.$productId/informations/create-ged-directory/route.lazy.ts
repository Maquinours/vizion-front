import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductViewInformationsViewCreateGedDirectoryModalView from '../../../../../views/App/views/Product/views/Informations/views/CreateGedDirectoryModal/CreateGedDirectoryModal';

export const Route = createLazyFileRoute('/app/products/$productId/informations/create-ged-directory')({
  component: AppViewProductViewInformationsViewCreateGedDirectoryModalView,
});
