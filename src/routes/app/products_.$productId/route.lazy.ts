import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductView from '../../../views/App/views/Product/Product';

export const Route = createLazyFileRoute('/app/products/$productId')({
  component: AppViewProductView,
});
