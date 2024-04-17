import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewProductShelvesViewCreateModalView from '../../../../../views/App/views/Tools/views/ProductShelves/views/CreateModal/CreateModal';

export const Route = createLazyFileRoute('/app/tools/product-shelves/create')({
  component: AppViewToolsViewProductShelvesViewCreateModalView,
});
