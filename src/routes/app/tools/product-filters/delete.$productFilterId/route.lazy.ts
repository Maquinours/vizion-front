import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewProductFiltersViewDeleteModalView from '../../../../../views/App/views/Tools/views/ProductFilters/views/DeleteModal/DeleteModal';

export const Route = createLazyFileRoute('/app/tools/product-filters/delete/$productFilterId')({
  component: AppViewToolsViewProductFiltersViewDeleteModalView,
});
