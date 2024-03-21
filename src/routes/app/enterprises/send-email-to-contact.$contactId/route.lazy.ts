import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterprisesViewSendEmailToContactModalView from '../../../../views/App/views/Enterprises/views/SendEmailToContactModal/SendEmailToContactModal';

export const Route = createLazyFileRoute('/app/enterprises/send-email-to-contact/$contactId')({
  component: AppViewEnterprisesViewSendEmailToContactModalView,
});
