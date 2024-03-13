import ReactModal from 'react-modal';
import SendEmailComponent from '../../../../../../../../components/SendEmail/SendEmail';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { taskQueryKeys } from '../../../../../../../../utils/constants/queryKeys/task';
import { getTaskById } from '../../../../../../../../utils/api/task';
import { emailQueryKeys } from '../../../../../../../../utils/constants/queryKeys/email';
import { getEmailById } from '../../../../../../../../utils/api/email';
import styles from './Reply.module.scss';

const Route = getRouteApi('/app/dashboard/task-email/$taskId/reply');

export default function AppViewDashboardViewTaskEmailModalViewReplyView() {
  const navigate = useNavigate();

  const { taskId } = Route.useParams();

  const { sendEmailModal: modal } = Route.useSearch();

  const { data: task } = useSuspenseQuery({
    queryKey: taskQueryKeys.detailById(taskId),
    queryFn: () => getTaskById(taskId),
  });

  const { data: email } = useSuspenseQuery({
    queryKey: emailQueryKeys.detailById(task.mailId!),
    queryFn: () => getEmailById(task.mailId!),
  });

  return (
    <ReactModal
      isOpen={true}
      onRequestClose={() => navigate({ from: Route.id, to: '..', search: (old) => old })}
      overlayClassName="Overlay"
      className={styles.modal}
    >
      <SendEmailComponent
        emailToReply={email}
        showPredefinedMessagesModal={modal === 'predefined-messages'}
        openPredefinedMessagesModal={() => navigate({ from: Route.id, search: (old) => ({ ...old, sendEmailModal: 'predefined-messages' }) })}
        closePredefinedMessagesModal={() => navigate({ from: Route.id, search: (old) => ({ ...old, sendEmailModal: undefined }) })}
      />
    </ReactModal>
  );
}
