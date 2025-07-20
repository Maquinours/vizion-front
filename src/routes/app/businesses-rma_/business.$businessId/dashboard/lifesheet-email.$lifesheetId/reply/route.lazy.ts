import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewDashboardViewLifesheetEmailModalViewReplyModalView from '../../../../../../../views/App/views/Business/views/Dashboard/views/LifesheetEmailModal/views/ReplyModal/ReplyModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/dashboard/lifesheet-email/$lifesheetId/reply')({
  component: AppViewBusinessViewDashboardViewLifesheetEmailModalViewReplyModalView,
});
