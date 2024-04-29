import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewBpView from '../../../../../views/App/views/Business/views/Bp/Bp';

export const Route = createLazyFileRoute('/app/businesses-rma/business/$businessId/bp')({
  component: AppViewBusinessViewBpView,
});
