import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewEmailsView from '../../../../views/App/views/Tools/views/Emails/Emails';

export const Route = createLazyFileRoute('/app/tools/emails')({
  component: AppViewToolsViewEmailsView,
});
