import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsMenuViewCreateProductModalView from '../../../../../views/App/views/Tools/views/Menu/views/CreateProductModal/CreateProductModal';

export const Route = createLazyFileRoute('/app/tools/menu/create-product')({
  component: AppViewToolsMenuViewCreateProductModalView,
});
