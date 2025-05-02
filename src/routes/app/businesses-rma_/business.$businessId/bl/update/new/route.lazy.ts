import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewBlViewUpdateModalViewNewModalView from '../../../../../../../views/App/views/Business/views/Bl/views/UpdateModal/views/NewModal/NewModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/bl/update/new')({
  component: AppViewBusinessViewBlViewUpdateModalViewNewModalView,
});
