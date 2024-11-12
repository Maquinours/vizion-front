import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import EmailModalComponent from '../../../../../../components/EmailModal/EmailModal';
import { queries } from '../../../../../../utils/constants/queryKeys';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId/task-email/$taskId');
const routePath = '/app/enterprises/$enterpriseId/task-email/$taskId';

export default function AppViewEnterpriseViewTaskEmailModalView() {
  const navigate = routeApi.useNavigate();

  const { taskId } = routeApi.useParams();

  const { data: task } = useSuspenseQuery(queries.tasks.detail(taskId));

  return (
    <EmailModalComponent
      emailId={task.mailId!}
      onClose={() => navigate({ to: '../..', search: true, replace: true, resetScroll: false })}
      replyLink={{
        from: routePath,
        to: '/app/enterprises/$enterpriseId/task-email/$taskId/reply',
        search: true,
        replace: true,
        resetScroll: false,
      }}
    />
  );
}
