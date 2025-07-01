import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewDashboardViewLifesheetEmailModalViewResendModalView from '../../../../../../../views/App/views/Business/views/Dashboard/views/LifesheetEmailModal/views/ResendModal/ResendModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/dashboard/lifesheet-email/$lifesheetId/resend')({
  component: AppViewBusinessViewDashboardViewLifesheetEmailModalViewResendModalView,
});
