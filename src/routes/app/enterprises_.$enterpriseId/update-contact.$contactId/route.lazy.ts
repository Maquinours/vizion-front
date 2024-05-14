import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterpriseViewUpdateContactModalView from '../../../../views/App/views/Enterprise/views/UpdateContactModal/UpdateContactModal';

export const Route = createLazyFileRoute('/app/enterprises/$enterpriseId/update-contact/$contactId')({
  component: AppViewEnterpriseViewUpdateContactModalView,
});
