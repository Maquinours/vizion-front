import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewSendEmailView from '../../../../../views/App/views/Tools/views/SendEmail/SendEmail';

export const Route = createLazyFileRoute('/app/tools/emails/send')({
  component: AppViewToolsViewSendEmailView,
});
