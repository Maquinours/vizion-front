import { getRouteApi, useNavigate } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../../../components/SendEmailModal/SendEmailModal';

const routeApi = getRouteApi('/app/products/$productId/informations/task-email/$taskId/reply');

export default function AppViewProductViewInformationsViewTaskEmailModalViewReplyModalView() {
  const navigate = useNavigate();

  const { email } = routeApi.useLoaderData();

  return (
    <SendEmailModalComponent
      isOpen={true}
      onClose={() => navigate({ from: routeApi.id, to: '..', search: true, replace: true, resetScroll: false })}
      emailToReply={email}
    />
  );
}
