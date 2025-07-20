import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewEmailsViewEmailModalViewResendModalView from '../../../../../../views/App/views/Tools/views/Emails/views/EmailModal/views/ResendModal/ResendModal';

export const Route = createLazyFileRoute('/app/tools/emails/$emailId/resend')({
  component: AppViewToolsViewEmailsViewEmailModalViewResendModalView,
});
