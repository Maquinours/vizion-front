import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewBlViewSendByEmailModalView from '../../../../../../views/App/views/Business/views/Bl/views/SendByEmailModal/SendByEmailModal';

export const Route = createLazyFileRoute('/app/businesses-rma/business/$businessId/bl/send-by-email')({
  component: AppViewBusinessViewBlViewSendByEmailModalView,
});
