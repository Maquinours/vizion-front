import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductsView from '../../../views/App/views/Products/Products';

export const Route = createLazyFileRoute('/app/products')({
  component: AppViewProductsView,
});
