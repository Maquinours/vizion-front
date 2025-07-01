import { getRouteApi } from '@tanstack/react-router';
import EmailModalComponent from '../../../../../../../../../components/EmailModal/EmailModal';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/dashboard/email-history/$emailId');

export default function AppViewBusinessViewDashboardViewEmailHistoryModalViewEmailModalView() {
  const navigate = routeApi.useNavigate();

  const { emailId } = routeApi.useParams();

  return (
    <EmailModalComponent
      onClose={() => navigate({ to: '..', search: true, replace: true, resetScroll: false })}
      emailId={emailId}
      replyLink={{ to: '/app/businesses-rma/business/$businessId/dashboard/email-history/$emailId/reply', search: true, replace: true, resetScroll: false }}
      resendLink={{ to: '/app/businesses-rma/business/$businessId/dashboard/email-history/$emailId/resend', search: true, replace: true, resetScroll: false }}
    />
  );
}
