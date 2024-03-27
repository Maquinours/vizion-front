import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { taskQueryKeys } from '../../../../../../../../utils/constants/queryKeys/task';
import { getTaskById } from '../../../../../../../../utils/api/task';
import EmailModalComponent from '../../../../../../../../components/EmailModal/EmailModal';

const routeApi = getRouteApi('/app/products/$productId/informations/task-email/$taskId');

export default function AppViewProductViewInformationsViewTaskEmailModalView() {
  const navigate = useNavigate();

  const { taskId } = routeApi.useParams();

  const { data: task } = useSuspenseQuery({
    queryKey: taskQueryKeys.detailById(taskId),
    queryFn: () => getTaskById(taskId),
  });

  return (
    <EmailModalComponent
      emailId={task.mailId!}
      onClose={() => navigate({ from: routeApi.id, to: '../..', search: (old) => old })}
      replyLink={{ to: '/app/products/$productId/informations/task-email/$taskId/reply', search: (old) => old, params: (old) => old }}
    />
  );
}
