import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductViewInformationsView from '../../../../views/App/views/Product/views/Informations/Informations';

export const Route = createLazyFileRoute('/app/products/$productId/informations')({
  component: AppViewProductViewInformationsView,
});
