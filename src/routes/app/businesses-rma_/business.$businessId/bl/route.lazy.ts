import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewBlView from '../../../../../views/App/views/Business/views/Bl/Bl';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/bl')({
  component: AppViewBusinessViewBlView,
});
