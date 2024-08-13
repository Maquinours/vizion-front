import { getRouteApi, useNavigate } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../components/SendEmailModal/SendEmailModal';

const routeApi = getRouteApi('/app/dashboard/task-email/$taskId/reply');

export default function AppViewDashboardViewTaskEmailModalViewReplyView() {
  const navigate = useNavigate();

  const { email } = routeApi.useLoaderData();

  return (
    <SendEmailModalComponent
      isOpen={true}
      onClose={() => navigate({ from: routeApi.id, to: '..', search: (old) => old, replace: true, resetScroll: false })}
      emailToReply={email}
    />
  );
}
