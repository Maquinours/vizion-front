import { getRouteApi } from '@tanstack/react-router';
import EmailModalComponent from '../../../../../../../../components/EmailModal/EmailModal';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId/email-history/email/$emailId');

export default function AppViewEnterpriseViewEmailHistoryModalViewEmailModalView() {
  const navigate = routeApi.useNavigate();

  const { emailId } = routeApi.useParams();

  return (
    <EmailModalComponent
      onClose={() => navigate({ to: '../..', search: true, replace: true, resetScroll: false })}
      emailId={emailId}
      replyLink={{ to: '/app/businesses-rma/business/$businessId/dashboard/email-history/$emailId/reply', search: true, replace: true, resetScroll: false }}
    />
  );
}
