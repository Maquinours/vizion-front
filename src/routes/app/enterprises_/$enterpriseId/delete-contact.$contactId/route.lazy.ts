import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterpriseViewDeleteContactModalView from '../../../../../views/App/views/Enterprise/views/DeleteContactModal/DeleteContactModal';

export const Route = createLazyFileRoute('/app/enterprises/$enterpriseId/delete-contact/$contactId')({
  component: AppViewEnterpriseViewDeleteContactModalView,
});
