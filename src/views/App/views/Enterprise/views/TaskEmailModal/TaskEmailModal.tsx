import { getRouteApi, useNavigate } from '@tanstack/react-router';
import EmailModalComponent from '../../../../../../components/EmailModal/EmailModal';
import { useSuspenseQuery } from '@tanstack/react-query';
import { taskQueryKeys } from '../../../../../../utils/constants/queryKeys/task';
import { getTaskById } from '../../../../../../utils/api/task';

const Route = getRouteApi('/app/enterprises/$enterpriseId/task-email/$taskId');

export default function AppViewEnterpriseViewTaskEmailModalView() {
  const navigate = useNavigate();

  const { taskId } = Route.useParams();

  const { data: task } = useSuspenseQuery({
    queryKey: taskQueryKeys.detailById(taskId),
    queryFn: () => getTaskById(taskId),
  });

  return (
    <EmailModalComponent
      emailId={task.mailId!}
      onClose={() => navigate({ from: Route.id, to: '../..', search: (old) => old })}
      replyLink={{ from: Route.id, to: '/app/enterprises/$enterpriseId/task-email/$taskId/reply', search: (old) => old, params: (old) => old }}
    />
  );
}
