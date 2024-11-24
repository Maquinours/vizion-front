import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductViewInformationsViewRenameGedObjectModalView from '../../../../../views/App/views/Product/views/Informations/views/RenameGedObjectModal/RenameGedObjectModal';

export const Route = createLazyFileRoute('/app/products_/$productId/informations/rename-ged-object')({
  component: AppViewProductViewInformationsViewRenameGedObjectModalView,
});
