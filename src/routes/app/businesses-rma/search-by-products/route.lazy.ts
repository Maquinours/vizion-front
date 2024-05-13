import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessesRmaViewSearchByProductsModalView from '../../../../views/App/views/BusinessesRma/views/SearchByProductsModal/SearchByProductsModal';

export const Route = createLazyFileRoute('/app/businesses-rma/search-by-products')({
  component: AppViewBusinessesRmaViewSearchByProductsModalView,
});
