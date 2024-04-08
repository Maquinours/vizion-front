import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { taskQueryKeys } from '../../../../../../../../utils/constants/queryKeys/task';
import { getTaskById } from '../../../../../../../../utils/api/task';
import { emails } from '../../../../../../../../utils/constants/queryKeys/email';
import SendEmailModalComponent from '../../../../../../../../components/SendEmailModal/SendEmailModal';

const routeApi = getRouteApi('/app/dashboard/task-email/$taskId/reply');

export default function AppViewDashboardViewTaskEmailModalViewReplyView() {
  const navigate = useNavigate();

  const { taskId } = routeApi.useParams();

  const { data: task } = useSuspenseQuery({
    queryKey: taskQueryKeys.detailById(taskId),
    queryFn: () => getTaskById(taskId),
  });

  const { data: email } = useSuspenseQuery(emails.detail(task.mailId!));

  return <SendEmailModalComponent isOpen={true} onClose={() => navigate({ from: routeApi.id, to: '..', search: (old) => old })} emailToReply={email} />;
}
