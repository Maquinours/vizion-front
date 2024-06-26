import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import ReactModal from 'react-modal';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { emails } from '../../../../../../utils/constants/queryKeys/email';
import styles from './TaskEmailModal.module.scss';
import AppViewDashboardViewTaskEmailModalViewAttachmentsComponent from './components/Attachments/Attachments';
import AppViewDashboardViewTaskEmailModalViewFooterComponent from './components/Footer/Footer';
import AppViewDashboardViewTaskEmailModalViewInformationsComponent from './components/Informations/Informations';

const Route = getRouteApi('/app/dashboard/task-email/$taskId');

export default function AppViewDashboardViewTaskEmailModalView() {
  const navigate = useNavigate();

  const { taskId } = Route.useParams();

  const { data: task } = useSuspenseQuery(queries.tasks.detail(taskId));

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
