import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductViewInformationsViewDeleteLifesheetModalView from '../../../../../views/App/views/Product/views/Informations/views/DeleteLifesheetModal/DeleteLifesheetModal';

export const Route = createLazyFileRoute('/app/products_/$productId/informations/delete-lifesheet-comment/$lifesheetId')({
  component: AppViewProductViewInformationsViewDeleteLifesheetModalView,
});
