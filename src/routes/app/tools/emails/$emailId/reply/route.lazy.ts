import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewToolsViewEmailsViewEmailModalViewReplyModalView from '../../../../../../views/App/views/Tools/views/Emails/views/EmailModal/views/ReplyModal/ReplyModal';

export const Route = createLazyFileRoute('/app/tools/emails/$emailId/reply')({
  component: AppViewToolsViewEmailsViewEmailModalViewReplyModalView,
});
