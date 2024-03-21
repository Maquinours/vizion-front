import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterprisesViewUpdateContactPasswordModalView from '../../../../views/App/views/Enterprises/views/UpdateContactPasswordModal/UpdateContactPasswordModal';

export const Route = createLazyFileRoute('/app/enterprises/update-contact-password/$contactId')({
  component: AppViewEnterprisesViewUpdateContactPasswordModalView,
});
