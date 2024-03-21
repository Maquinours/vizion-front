import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterprisesViewCreateContactBusinessModalView from '../../../../views/App/views/Enterprises/views/CreateContactBusinessModal/CreateContactBusinessModal';

export const Route = createLazyFileRoute('/app/enterprises/create-contact-business/$contactId')({
  component: AppViewEnterprisesViewCreateContactBusinessModalView,
});
