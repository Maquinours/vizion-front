import { getRouteApi } from '@tanstack/react-router';
import ReplyEmailModalComponent from '../../../../../../../../components/ReplyEmailModal/ReplyEmailModal';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId/lifesheet-email/$lifesheetId/reply');

export default function AppViewEnterpriseViewLifesheetEmailModalViewReplyModalView() {
  const navigate = routeApi.useNavigate();

  const { email } = routeApi.useLoaderData();

  return <ReplyEmailModalComponent isOpen onClose={() => navigate({ to: '..', search: true, replace: true, resetScroll: false })} email={email} />;
}
