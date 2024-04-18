import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewProductInventoryViewValidateQuantitiesModalView from '../../../../../views/App/views/Tools/views/ProductInventory/views/ValidateQuantitiesModal/ValidateQuantitiesModal';

export const Route = createLazyFileRoute('/app/tools/product-inventory/validate-quantities')({
  component: AppViewToolsViewProductInventoryViewValidateQuantitiesModalView,
});
