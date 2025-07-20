import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewEnterpriseViewLifesheetEmailModalViewReplyModalView from '../../../../../views/App/views/Enterprise/views/LifesheetEmailModal/views/ReplyModal/ReplyModal';

export const Route = createLazyFileRoute('/app/enterprises_/$enterpriseId/lifesheet-email/$lifesheetId/reply')({
  component: AppViewEnterpriseViewLifesheetEmailModalViewReplyModalView,
});
