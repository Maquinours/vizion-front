import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewBpViewAddSerialModalView from '../../../../../../views/App/views/Business/views/Bp/views/AddSerialModal/AddSerialModal';

export const Route = createLazyFileRoute('/app/businesses-rma/business/$businessId/bp/add-serial/$detailId')({
  component: AppViewBusinessViewBpViewAddSerialModalView,
});
