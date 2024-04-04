import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewPredefinedMessagesViewCreateModalView from '../../../../../views/App/views/Tools/views/PredefinedMessages/views/CreateModal/CreateModal';

export const Route = createLazyFileRoute('/app/tools/predefined-messages/create')({
  component: AppViewToolsViewPredefinedMessagesViewCreateModalView,
});
