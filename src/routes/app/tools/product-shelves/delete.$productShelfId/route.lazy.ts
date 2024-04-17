import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewProductShelvesViewDeleteModalView from '../../../../../views/App/views/Tools/views/ProductShelves/views/DeleteModal/DeleteModal';

export const Route = createLazyFileRoute('/app/tools/product-shelves/delete/$productShelfId')({
  component: AppViewToolsViewProductShelvesViewDeleteModalView,
});
