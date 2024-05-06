import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewMailsViewUpdateModalView from '../../../../../views/App/views/Tools/views/Mails/views/UpdateModal/UpdateModal';

export const Route = createLazyFileRoute('/app/tools/mails/update/$mailId')({
  component: AppViewToolsViewMailsViewUpdateModalView,
});
