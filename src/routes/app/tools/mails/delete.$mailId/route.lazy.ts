import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewMailsViewDeleteModalView from '../../../../../views/App/views/Tools/views/Mails/views/DeleteModal/DeleteModal';

export const Route = createLazyFileRoute('/app/tools/mails/delete/$mailId')({
  component: AppViewToolsViewMailsViewDeleteModalView,
});
