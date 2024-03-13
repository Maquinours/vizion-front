import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import { taskQueryKeys } from '../../../../../../utils/constants/queryKeys/task';
import { getTaskById } from '../../../../../../utils/api/task';
import { formatDate } from '../../../../../../utils/functions/dates';
import styles from './PersonalTaskDetailsModal.module.scss';

const Route = getRouteApi('/app/dashboard/personal-task-details/$taskId');

export default function AppViewDashboardViewPersonalTaskDetailsModalView() {
  const navigate = useNavigate();

  const { taskId } = Route.useParams();

  const { data: task } = useSuspenseQuery({
    queryKey: taskQueryKeys.detailById(taskId),
    queryFn: () => getTaskById(taskId),
  });

  const onClose = () => {
    navigate({ from: Route.id, to: '../..', search: (old) => old });
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
                  <td>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: task.content ?? '',
                      }}
                    ></div>
                  </td>
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
