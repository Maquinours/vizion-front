import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewRmaViewSupportViewDeleteLifesheetModalView from '../../../../../../views/App/views/Rma/views/Support/views/DeleteLifesheetModal/DeleteLifesheetModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/rma/$rmaId/support/delete-lifesheet/$lifesheetId')({
  component: AppViewRmaViewSupportViewDeleteLifesheetModalView,
});
