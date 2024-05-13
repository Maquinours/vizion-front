import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewMailsView from '../../../../views/App/views/Tools/views/Mails/Mails';

export const Route = createLazyFileRoute('/app/tools/mails')({
  component: AppViewToolsViewMailsView,
});
