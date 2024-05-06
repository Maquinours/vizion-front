import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewMailsViewShowModalView from '../../../../../views/App/views/Tools/views/Mails/views/ShowModal/ShowModal';

export const Route = createLazyFileRoute('/app/tools/mails/show/$mailId')({
  component: AppViewToolsViewMailsViewShowModalView,
});
