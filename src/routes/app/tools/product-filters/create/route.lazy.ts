import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewProductFiltersViewCreateModalView from '../../../../../views/App/views/Tools/views/ProductFilters/views/CreateModal/CreateModal';

export const Route = createLazyFileRoute('/app/tools/product-filters/create')({
  component: AppViewToolsViewProductFiltersViewCreateModalView,
});
