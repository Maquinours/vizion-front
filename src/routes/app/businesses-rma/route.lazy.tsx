import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessesRmaView from '../../../views/App/views/BusinessesRma/BusinessesRma';

export const Route = createLazyFileRoute('/app/businesses-rma')({
  component: AppViewBusinessesRmaView,
});
