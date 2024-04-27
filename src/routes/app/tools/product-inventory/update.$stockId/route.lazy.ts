import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewProductInventoryViewUpdateModalView from '../../../../../views/App/views/Tools/views/ProductInventory/views/UpdateModal/UpdateModal';

export const Route = createLazyFileRoute('/app/tools/product-inventory/update/$stockId')({
  component: AppViewToolsViewProductInventoryViewUpdateModalView,
});
