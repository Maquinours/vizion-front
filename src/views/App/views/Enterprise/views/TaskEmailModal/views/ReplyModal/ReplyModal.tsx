import { getRouteApi } from '@tanstack/react-router';
import ReplyEmailModalComponent from '../../../../../../../../components/ReplyEmailModal/ReplyEmailModal';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId/task-email/$taskId/reply');

export default function AppViewEnterpriseViewTaskEmailModalViewReplyModalView() {
  const navigate = routeApi.useNavigate();

  const { email } = routeApi.useLoaderData();

  return <ReplyEmailModalComponent isOpen onClose={() => navigate({ to: '..', search: true, replace: true, resetScroll: false })} email={email} />;
}
