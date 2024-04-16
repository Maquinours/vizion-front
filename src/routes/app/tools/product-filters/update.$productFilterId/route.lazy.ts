import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewProductFiltersViewUpdateModalView from '../../../../../views/App/views/Tools/views/ProductFilters/views/UpdateModal/UpdateModal';

export const Route = createLazyFileRoute('/app/tools/product-filters/update/$productFilterId')({
  component: AppViewToolsViewProductFiltersViewUpdateModalView,
});
