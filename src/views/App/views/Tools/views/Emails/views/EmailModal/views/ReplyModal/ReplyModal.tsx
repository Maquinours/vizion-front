import { getRouteApi } from '@tanstack/react-router';
import ReplyEmailModalComponent from '../../../../../../../../../../components/ReplyEmailModal/ReplyEmailModal';

const routeApi = getRouteApi('/app/tools/emails/$emailId/reply');

export default function AppViewToolsViewEmailsViewEmailModalViewReplyModalView() {
  const navigate = routeApi.useNavigate();

  const { email } = routeApi.useLoaderData();

  return <ReplyEmailModalComponent isOpen onClose={() => navigate({ to: '..', search: true, replace: true, resetScroll: false })} email={email} />;
}
