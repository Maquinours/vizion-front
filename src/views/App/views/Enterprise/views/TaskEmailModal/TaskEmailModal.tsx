import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import EmailModalComponent from '../../../../../../components/EmailModal/EmailModal';
import { queries } from '../../../../../../utils/constants/queryKeys';

const Route = getRouteApi('/app/enterprises/$enterpriseId/task-email/$taskId');

export default function AppViewEnterpriseViewTaskEmailModalView() {
  const navigate = useNavigate();

  const { taskId } = Route.useParams();

  const { data: task } = useSuspenseQuery(queries.tasks.detail(taskId));

  return (
    <EmailModalComponent
      emailId={task.mailId!}
      onClose={() => navigate({ from: Route.id, to: '../..', search: (old) => old, replace: true })}
      replyLink={{ from: Route.id, to: '/app/enterprises/$enterpriseId/task-email/$taskId/reply', search: (old) => old, params: (old) => old, replace: true }}
    />
  );
}
