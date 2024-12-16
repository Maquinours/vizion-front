import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import ReactModal from 'react-modal';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { formatDate } from '../../../../../../utils/functions/dates';
import styles from './PersonalTaskDetailsModal.module.scss';

const routeApi = getRouteApi('/app/dashboard/personal-task-details/$taskId');

export default function AppViewDashboardViewPersonalTaskDetailsModalView() {
  const navigate = routeApi.useNavigate();

  const { taskId } = routeApi.useParams();

  const { data: task } = useSuspenseQuery(queries.tasks.detail(taskId));

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <p>Détails de la charge de travail</p>
        </div>

        <div className={styles.modal_details}>
          <div className={styles.content}>
            <table>
              <tbody>
                <tr>
                  <td>{"Nom de l'affaire"}</td>
                  <td>{task.businessName ?? 'Non relié à une affaire'}</td>
                </tr>
                <tr>
                  <td>{"Nom de l'entreprise"}</td>
                  <td>{task.enterpriseName ?? ''}</td>
                </tr>
                <tr>
                  <td>Contenu</td>
                  <td>{parse(DOMPurify.sanitize(task.content ?? ''))}</td>
                </tr>
                <tr>
                  <td>Date de création</td>
                  <td>{task.createdDate ? formatDate(task.createdDate) : 'Inconnu'}</td>
                </tr>
                <tr>
                  <td>Date de fin</td>
                  <td>{task.deadline ? formatDate(task.deadline) : 'Inconnu'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ textAlign: 'right' }}>
            <button className="btn btn-primary" onClick={onClose}>
              Fermer
            </button>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
