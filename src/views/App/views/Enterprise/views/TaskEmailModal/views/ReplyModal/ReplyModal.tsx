import ReactModal from 'react-modal';
import SendEmailComponent from '../../../../../../../../components/SendEmail/SendEmail';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { taskQueryKeys } from '../../../../../../../../utils/constants/queryKeys/task';
import { getTaskById } from '../../../../../../../../utils/api/task';
import { emailQueryKeys } from '../../../../../../../../utils/constants/queryKeys/email';
import { getEmailById } from '../../../../../../../../utils/api/email';

const Route = getRouteApi('/app/enterprises/$enterpriseId/task-email/$taskId/reply');

export default function AppViewEnterpriseViewTaskEmailModalViewReplyModalView() {
  const navigate = useNavigate();

  const { taskId } = Route.useParams();

  const { data: task } = useSuspenseQuery({
    queryKey: taskQueryKeys.detailById(taskId),
    queryFn: () => getTaskById(taskId),
  });

  const { data: email } = useSuspenseQuery({
    queryKey: emailQueryKeys.detailById(task.mailId!),
    queryFn: () => getEmailById(task.mailId!),
  });

  return (
    <ReactModal isOpen={true} onRequestClose={() => navigate({ from: Route.id, to: '..', search: (old) => old })} overlayClassName="Overlay">
      <SendEmailComponent emailToReply={email} />
    </ReactModal>
  );
}
