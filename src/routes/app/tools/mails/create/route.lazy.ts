import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewMailsViewCreateModalView from '../../../../../views/App/views/Tools/views/Mails/views/CreateModal/CreateModal';

export const Route = createLazyFileRoute('/app/tools/mails/create')({
  component: AppViewToolsViewMailsViewCreateModalView,
});
