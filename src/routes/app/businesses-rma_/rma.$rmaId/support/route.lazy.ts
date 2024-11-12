import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewRmaViewSupportView from '../../../../../views/App/views/Rma/views/Support/Support';

export const Route = createLazyFileRoute('/app/businesses-rma_/rma/$rmaId/support')({
  component: AppViewRmaViewSupportView,
});
