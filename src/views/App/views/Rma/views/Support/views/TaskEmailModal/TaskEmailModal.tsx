import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import EmailModalComponent from '../../../../../../../../components/EmailModal/EmailModal';
import { queries } from '../../../../../../../../utils/constants/queryKeys';

const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/support/task-email/$taskId');

export default function AppViewRmaViewSupportViewTaskEmailModalView() {
  const navigate = routeApi.useNavigate();

  const { taskId } = routeApi.useParams();

  const { data: task } = useSuspenseQuery(queries.tasks.detail(taskId));

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  return (
    <EmailModalComponent
      emailId={task.mailId!}
      onClose={onClose}
      replyLink={{ to: '/app/businesses-rma/rma/$rmaId/support/task-email/$taskId/reply', search: true, replace: true, resetScroll: false }}
    />
  );
}
