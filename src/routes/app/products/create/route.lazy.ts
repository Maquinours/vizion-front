import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductsViewCreateModalView from '../../../../views/App/views/Products/views/CreateModal/CreateModal';

export const Route = createLazyFileRoute('/app/products/create')({
  component: AppViewProductsViewCreateModalView,
});
