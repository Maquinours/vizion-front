import { getRouteApi } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../../../components/SendEmailModal/SendEmailModal';

const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/support/task-email/$taskId/reply');

export default function AppViewRmaViewSupportViewTaskEmailModalViewReplyModalView() {
  const navigate = routeApi.useNavigate();

  const { email } = routeApi.useLoaderData();

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  return <SendEmailModalComponent isOpen={true} emailToReply={email} onClose={onClose} />;
}
