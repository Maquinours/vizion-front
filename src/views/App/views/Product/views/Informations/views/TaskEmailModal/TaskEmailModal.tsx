import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import EmailModalComponent from '../../../../../../../../components/EmailModal/EmailModal';
import { queries } from '../../../../../../../../utils/constants/queryKeys';

const routeApi = getRouteApi('/app/products_/$productId/informations/task-email/$taskId');

export default function AppViewProductViewInformationsViewTaskEmailModalView() {
  const navigate = routeApi.useNavigate();

  const { taskId } = routeApi.useParams();

  const { data: task } = useSuspenseQuery(queries.tasks.detail(taskId));

  return (
    <EmailModalComponent
      emailId={task.mailId!}
      onClose={() => navigate({ to: '../..', search: true, replace: true, resetScroll: false })}
      replyLink={{ to: '/app/products/$productId/informations/task-email/$taskId/reply', search: true, replace: true, resetScroll: false }}
      resendLink={{ to: '/app/products/$productId/informations/task-email/$taskId/resend', search: true, replace: true, resetScroll: false }}
    />
  );
}
