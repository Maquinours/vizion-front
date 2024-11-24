import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewBpViewDeleteSerialModalView from '../../../../../../views/App/views/Business/views/Bp/views/DeleteSerialModal/DeleteSerialModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/bp/delete-serial/$serialId')({
  component: AppViewBusinessViewBpViewDeleteSerialModalView,
});
