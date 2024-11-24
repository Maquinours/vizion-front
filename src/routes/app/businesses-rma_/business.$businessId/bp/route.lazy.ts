import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewBpView from '../../../../../views/App/views/Business/views/Bp/Bp';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/bp')({
  component: AppViewBusinessViewBpView,
});
