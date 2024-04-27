import { getRouteApi, useNavigate } from '@tanstack/react-router';
import EmailModalComponent from '../../../../../../../../components/EmailModal/EmailModal';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/dashboard/task-email/$taskId');

export default function AppViewBusinessViewDashboardViewTaskEmailModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { taskId } = routeApi.useParams();

  const { data: task } = useSuspenseQuery(queries.tasks.detail(taskId));

  const onClose = () => {
    navigate({ to: '../..', search: (old) => old, replace: true });
  };

  return <EmailModalComponent emailId={task.mailId!} onClose={onClose} />;
}
