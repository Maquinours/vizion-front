import { getRouteApi } from '@tanstack/react-router';
import ResendEmailModalComponent from '../../../../../../../../../../components/ResendEmailModal/ResendEmailModal';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/dashboard/email-history/$emailId/resend');

export default function AppViewBusinessViewDashboardViewEmailHistoryModalViewEmailModalViewResendModalView() {
  const navigate = routeApi.useNavigate();

  const { email } = routeApi.useLoaderData();

  return <ResendEmailModalComponent isOpen onClose={() => navigate({ to: '..', search: true, replace: true, resetScroll: false })} email={email} />;
}
