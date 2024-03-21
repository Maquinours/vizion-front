import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterprisesViewCreateContactModalView from '../../../../views/App/views/Enterprises/views/CreateContactModal/CreateContactModal';

export const Route = createLazyFileRoute('/app/enterprises/create-contact/$enterpriseId')({
  component: AppViewEnterprisesViewCreateContactModalView,
});
