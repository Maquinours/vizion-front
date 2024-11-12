import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewBpViewCreateSerialRmaModalView from '../../../../../../views/App/views/Business/views/Bp/views/CreateSerialRmaModal/CreateSerialRmaModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/bp/create-serial-rma/$serialId')({
  component: AppViewBusinessViewBpViewCreateSerialRmaModalView,
});
