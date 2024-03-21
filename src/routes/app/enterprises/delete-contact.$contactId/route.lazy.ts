import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterprisesViewDeleteContactModal from '../../../../views/App/views/Enterprises/views/DeleteContactModal/DeleteContactModal';

export const Route = createLazyFileRoute('/app/enterprises/delete-contact/$contactId')({
  component: AppViewEnterprisesViewDeleteContactModal,
});
