import { getRouteApi, useNavigate } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../components/SendEmailModal/SendEmailModal';

const Route = getRouteApi('/app/enterprises/$enterpriseId/task-email/$taskId/reply');

export default function AppViewEnterpriseViewTaskEmailModalViewReplyModalView() {
  const navigate = useNavigate();

  const { email } = Route.useLoaderData();

  return (
    <SendEmailModalComponent
      isOpen
      onClose={() => navigate({ from: Route.id, to: '..', search: (old) => old, replace: true, resetScroll: false })}
      emailToReply={email}
    />
  );
}
