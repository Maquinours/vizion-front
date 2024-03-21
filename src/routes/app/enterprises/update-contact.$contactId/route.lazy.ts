import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterprisesViewUpdateContactModalView from '../../../../views/App/views/Enterprises/views/UpdateContactModal/UpdateContactModal';

export const Route = createLazyFileRoute('/app/enterprises/update-contact/$contactId')({
  component: AppViewEnterprisesViewUpdateContactModalView,
});
