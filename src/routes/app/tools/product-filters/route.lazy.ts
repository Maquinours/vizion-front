import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewProductFiltersView from '../../../../views/App/views/Tools/views/ProductFilters/ProductFilters';

export const Route = createLazyFileRoute('/app/tools/product-filters')({
  component: AppViewToolsViewProductFiltersView,
});
