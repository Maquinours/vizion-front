import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import AppViewDashboardViewTaskEmailModalViewInformationsComponent from './components/Informations/Informations';
import { useSuspenseQuery } from '@tanstack/react-query';
import { taskQueryKeys } from '../../../../../../utils/constants/queryKeys/task';
import { emails } from '../../../../../../utils/constants/queryKeys/email';
import { getTaskById } from '../../../../../../utils/api/task';
import AppViewDashboardViewTaskEmailModalViewAttachmentsComponent from './components/Attachments/Attachments';
import AppViewDashboardViewTaskEmailModalViewFooterComponent from './components/Footer/Footer';
import styles from './TaskEmailModal.module.scss';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

const Route = getRouteApi('/app/dashboard/task-email/$taskId');

export default function AppViewDashboardViewTaskEmailModalView() {
  const navigate = useNavigate();

  const { taskId } = Route.useParams();

  const { data: task } = useSuspenseQuery({
    queryKey: taskQueryKeys.detailById(taskId),
    queryFn: () => getTaskById(taskId),
  });

  const { data: email } = useSuspenseQuery(emails.detail(task.mailId!));

  return (
    <ReactModal
      isOpen={true}
      onRequestClose={() => navigate({ from: Route.id, to: '../..', search: (old) => old })}
      className={styles.mail_modal}
      overlayClassName="Overlay"
    >
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <p>Objet du mail</p>
        </div>
        <div className={styles.modal_content}>
          <AppViewDashboardViewTaskEmailModalViewInformationsComponent email={email} />
          <AppViewDashboardViewTaskEmailModalViewAttachmentsComponent task={task} email={email} />
          <div className={styles.mailbox}>{parse(DOMPurify.sanitize(email.content))}</div>
        </div>
        <AppViewDashboardViewTaskEmailModalViewFooterComponent />
      </div>
    </ReactModal>
  );
}
