import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewSendEmailViewPredefinedMessagesModalView from '../../../../../../views/App/views/Tools/views/SendEmail/views/PredefinedMessagesModal/PredefinedMessagesModal';

export const Route = createLazyFileRoute('/app/tools/emails/send/predefined-messages')({
  component: AppViewToolsViewSendEmailViewPredefinedMessagesModalView,
});
