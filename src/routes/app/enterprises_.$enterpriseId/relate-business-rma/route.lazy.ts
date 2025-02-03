import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterpriseViewRelateBusinessRmaModalView from '../../../../views/App/views/Enterprise/views/RelateBusinessRmaModal/RelateBusinessRmaModal';

export const Route = createLazyFileRoute('/app/enterprises_/$enterpriseId/relate-business-rma')({
  component: AppViewEnterpriseViewRelateBusinessRmaModalView,
});
