import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewRmaViewSupportViewCreateLinkModalView from '../../../../../../views/App/views/Rma/views/Support/views/CreateLinkModal/CreateLinkModal';

export const Route = createLazyFileRoute('/app/businesses-rma/rma/$rmaId/support/create-link')({
  component: AppViewRmaViewSupportViewCreateLinkModalView,
});
