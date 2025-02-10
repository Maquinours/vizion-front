import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterpriseViewEmailHistoryModalViewEmailModalViewReplyModalView from '../../../../../../views/App/views/Enterprise/views/EmailHistoryModal/views/EmailModal/views/ReplyModal/ReplyModal';

export const Route = createLazyFileRoute('/app/enterprises_/$enterpriseId/email-history/email/$emailId/reply')({
  component: AppViewEnterpriseViewEmailHistoryModalViewEmailModalViewReplyModalView,
});
