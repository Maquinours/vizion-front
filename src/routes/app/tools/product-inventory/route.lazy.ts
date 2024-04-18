import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewProductInventoryView from '../../../../views/App/views/Tools/views/ProductInventory/ProductInventory';

export const Route = createLazyFileRoute('/app/tools/product-inventory')({
  component: AppViewToolsViewProductInventoryView,
});
