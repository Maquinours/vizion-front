import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterpriseViewCreateContactBusinessModalView from '../../../../../views/App/views/Enterprise/views/CreateContactBusinessModal/CreateContactBusinessModal';

export const Route = createLazyFileRoute('/app/enterprises/$enterpriseId/create-contact-business/$contactId')({
  component: AppViewEnterpriseViewCreateContactBusinessModalView,
});
