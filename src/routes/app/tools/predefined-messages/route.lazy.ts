import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewPredefinedMessagesView from '../../../../views/App/views/Tools/views/PredefinedMessages/PredefinedMessages';

export const Route = createLazyFileRoute('/app/tools/predefined-messages')({
  component: AppViewToolsViewPredefinedMessagesView,
});
