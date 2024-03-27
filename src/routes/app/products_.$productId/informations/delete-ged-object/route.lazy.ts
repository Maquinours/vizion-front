import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductViewInformationsViewDeleteGedObjectModalView from '../../../../../views/App/views/Product/views/Informations/views/DeleteGedObjectModal/DeleteGedObjectModal';

export const Route = createLazyFileRoute('/app/products/$productId/informations/delete-ged-object')({
  component: AppViewProductViewInformationsViewDeleteGedObjectModalView,
});
