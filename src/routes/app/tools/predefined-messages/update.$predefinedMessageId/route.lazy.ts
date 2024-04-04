import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewPredefinedMessagesViewUpdateModalView from '../../../../../views/App/views/Tools/views/PredefinedMessages/views/UpdateModal/UpdateModal';

export const Route = createLazyFileRoute('/app/tools/predefined-messages/update/$predefinedMessageId')({
  component: AppViewToolsViewPredefinedMessagesViewUpdateModalView,
});
