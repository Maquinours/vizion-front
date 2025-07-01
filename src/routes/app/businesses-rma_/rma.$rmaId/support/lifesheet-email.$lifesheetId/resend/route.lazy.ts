import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewRmaViewSupportViewLifesheetEmailModalViewResendModalView from '../../../../../../../views/App/views/Rma/views/Support/views/LifesheetEmailModal/views/ResendModal/ResendModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/rma/$rmaId/support/lifesheet-email/$lifesheetId/resend')({
  component: AppViewRmaViewSupportViewLifesheetEmailModalViewResendModalView,
});
