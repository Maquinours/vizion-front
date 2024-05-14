import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterpriseViewSendEmailToContactModalView from '../../../../views/App/views/Enterprise/views/SendEmailToContactModal/SendEmailToContactModal';

export const Route = createLazyFileRoute('/app/enterprises/$enterpriseId/send-email-to-contact/$contactId')({
  component: AppViewEnterpriseViewSendEmailToContactModalView,
});
