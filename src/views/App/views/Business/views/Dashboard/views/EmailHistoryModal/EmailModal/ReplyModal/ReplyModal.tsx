import { getRouteApi } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../../../components/SendEmailModal/SendEmailModal';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/dashboard/email-history/$emailId/reply');

export default function AppViewBusinessViewDashboardViewEmailHistoryModalViewEmailModalViewReplyModalView() {
  const navigate = routeApi.useNavigate();

  const { email } = routeApi.useLoaderData();

  return <SendEmailModalComponent isOpen={true} onClose={() => navigate({ to: '..', search: true, replace: true, resetScroll: false })} emailToReply={email} />;
}
