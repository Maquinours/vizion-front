import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewDashboardViewEmailHistoryModalViewEmailModalViewResendModalView from '../../../../../../../../views/App/views/Business/views/Dashboard/views/EmailHistoryModal/EmailModal/ResendModal/ResendModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/dashboard/email-history/$emailId/resend')({
  component: AppViewBusinessViewDashboardViewEmailHistoryModalViewEmailModalViewResendModalView,
});
