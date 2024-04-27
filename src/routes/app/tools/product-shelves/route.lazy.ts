import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewProductShelvesView from '../../../../views/App/views/Tools/views/ProductShelves/ProductShelves';

export const Route = createLazyFileRoute('/app/tools/product-shelves')({
  component: AppViewToolsViewProductShelvesView,
});
