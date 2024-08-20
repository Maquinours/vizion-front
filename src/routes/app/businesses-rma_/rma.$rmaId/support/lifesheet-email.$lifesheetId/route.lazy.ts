import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewRmaViewSupportViewLifesheetEmailModalView from '../../../../../../views/App/views/Rma/views/Support/views/LifesheetEmailModal/LifesheetEmailModal';

export const Route = createLazyFileRoute('/app/businesses-rma/rma/$rmaId/support/lifesheet-email/$lifesheetId')({
  component: AppViewRmaViewSupportViewLifesheetEmailModalView,
});
