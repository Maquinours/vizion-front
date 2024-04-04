import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewEmailsViewEmailModalView from '../../../../../views/App/views/Tools/views/Emails/views/EmailModal/EmailModal';

export const Route = createLazyFileRoute('/app/tools/emails/$emailId')({
  component: AppViewToolsViewEmailsViewEmailModalView,
});
