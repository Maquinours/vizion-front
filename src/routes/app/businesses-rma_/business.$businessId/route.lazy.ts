import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessView from '../../../../views/App/views/Business/Business';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId')({
  component: AppViewBusinessView,
});
