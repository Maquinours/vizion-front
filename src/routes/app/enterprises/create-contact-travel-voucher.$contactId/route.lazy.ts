import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterprisesViewCreateContactTravelVoucherModalView from '../../../../views/App/views/Enterprises/views/CreateContactTravelVoucherModal/CreateContactTravelVoucherModal';

export const Route = createLazyFileRoute('/app/enterprises/create-contact-travel-voucher/$contactId')({
  component: AppViewEnterprisesViewCreateContactTravelVoucherModalView,
});
