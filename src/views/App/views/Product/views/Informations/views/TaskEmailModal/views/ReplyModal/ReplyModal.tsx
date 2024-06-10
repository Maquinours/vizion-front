import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../../../components/SendEmailModal/SendEmailModal';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import { emails } from '../../../../../../../../../../utils/constants/queryKeys/email';

const routeApi = getRouteApi('/app/products/$productId/informations/task-email/$taskId/reply');

export default function AppViewProductViewInformationsViewTaskEmailModalViewReplyModalView() {
  const navigate = useNavigate();

  const { taskId } = routeApi.useParams();

  const { data: task } = useSuspenseQuery(queries.tasks.detail(taskId));

  const { data: email } = useSuspenseQuery(emails.detail(task.mailId!));

  return (
    <SendEmailModalComponent
      isOpen={true}
      onClose={() => navigate({ from: routeApi.id, to: '..', search: true, replace: true, resetScroll: false })}
      emailToReply={email}
    />
  );
}
