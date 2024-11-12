import { getRouteApi } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../components/SendEmailModal/SendEmailModal';

const routeApi = getRouteApi('/app/dashboard/task-email/$taskId/reply');

export default function AppViewDashboardViewTaskEmailModalViewReplyView() {
  const navigate = routeApi.useNavigate();

  const { email } = routeApi.useLoaderData();

  return <SendEmailModalComponent isOpen={true} onClose={() => navigate({ to: '..', search: true, replace: true, resetScroll: false })} emailToReply={email} />;
}
