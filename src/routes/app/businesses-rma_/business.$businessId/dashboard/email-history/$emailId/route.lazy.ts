import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewDashboardViewEmailHistoryModalViewEmailModalView from '../../../../../../../views/App/views/Business/views/Dashboard/views/MailHistoryModal/EmailModal/EmailModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/dashboard/email-history/$emailId')({
  component: AppViewBusinessViewDashboardViewEmailHistoryModalViewEmailModalView,
});
