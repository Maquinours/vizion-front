import { getRouteApi } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../components/SendEmailModal/SendEmailModal';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId/task-email/$taskId/reply');

export default function AppViewEnterpriseViewTaskEmailModalViewReplyModalView() {
  const navigate = routeApi.useNavigate();

  const { email } = routeApi.useLoaderData();

  return <SendEmailModalComponent isOpen onClose={() => navigate({ to: '..', search: true, replace: true, resetScroll: false })} emailToReply={email} />;
}
