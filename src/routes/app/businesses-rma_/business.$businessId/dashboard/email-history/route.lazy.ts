import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewBusinessViewDashboardViewEmailHistoryModalView from '../../../../../../views/App/views/Business/views/Dashboard/views/MailHistoryModal/EmailHistoryModal';

export const Route = createLazyFileRoute('/app/businesses-rma_/business/$businessId/dashboard/email-history')({
  component: AppViewBusinessViewDashboardViewEmailHistoryModalView,
});
