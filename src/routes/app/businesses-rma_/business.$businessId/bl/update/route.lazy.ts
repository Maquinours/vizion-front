import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewBlViewUpdateModalView from '../../../../../../views/App/views/Business/views/Bl/views/UpdateModal/UpdateModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/bl/update')({
  component: AppViewBusinessViewBlViewUpdateModalView,
});
