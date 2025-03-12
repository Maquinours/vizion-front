import { getRouteApi } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../../../components/SendEmailModal/SendEmailModal';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId/email-history/email/$emailId/reply');

export default function AppViewEnterpriseViewEmailHistoryModalViewEmailModalViewReplyModalView() {
  const navigate = routeApi.useNavigate();

  const { email } = routeApi.useLoaderData();

  return <SendEmailModalComponent isOpen={true} onClose={() => navigate({ to: '..', search: true, replace: true, resetScroll: false })} emailToReply={email} />;
}
