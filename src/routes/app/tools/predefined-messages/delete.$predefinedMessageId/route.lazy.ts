import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewPredefinedMessagesViewDeleteModalView from '../../../../../views/App/views/Tools/views/PredefinedMessages/views/DeleteModal/DeleteModal';

export const Route = createLazyFileRoute('/app/tools/predefined-messages/delete/$predefinedMessageId')({
  component: AppViewToolsViewPredefinedMessagesViewDeleteModalView,
});
