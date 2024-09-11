import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, Outlet, getRouteApi, useNavigate } from '@tanstack/react-router';
import moment from 'moment';
import { FaTrash } from 'react-icons/fa';
import { HiPencilAlt } from 'react-icons/hi';
import ReactModal from 'react-modal';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import styles from './DetailsModal.module.scss';

const routeApi = getRouteApi('/app/tools/scheduler/details/$rdvId');

export default function AppViewToolsViewSchedulerViewDetailsModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { rdvId } = routeApi.useParams();

  const { data: rdv } = useSuspenseQuery(queries.rdvs.detail(rdvId));

  const onClose = () => {
    navigate({ to: '../..', search: (old) => old, replace: true, resetScroll: false });
  };

  return (
    <>
      <ReactModal isOpen={true} onRequestClose={onClose} className={styles.event_modal} overlayClassName="Overlay">
        <div className={styles.modal_container}>
          <div className={styles.modal_header}>
            <div className={styles.modal_title}>
              <p>Détail du rendez-vous</p>
            </div>
          </div>
          <div className={styles.modal_content}>
            <div className={styles.modal_buttons}>
              <Link from={routeApi.id} to="./update" search replace resetScroll={false} preload="intent" className={styles.modal_header_icon}>
                <HiPencilAlt width="16" height="16" color="#16204E" />
              </Link>
              <Link from={routeApi.id} to="./delete" search replace resetScroll={false} preload="intent" className={styles.modal_header_icon}>
                <FaTrash width="16" height="16" color="#16204E" />
              </Link>
            </div>
            <div className={styles.table_container}>
              <table>
                <tbody>
                  <tr>
                    <td>Participants (s)</td>
                    <td>
                      <ul style={{ listStyle: 'inside' }}>
                        {rdv.infos.map((info) => (
                          <li
                            style={{
                              color: '#F24C52',
                              marginBottom: '2px',
                            }}
                            key={info.id}
                          >
                            {info.attributeToFirstName} {info.attributeToLastName}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td>Titre</td>
                    <td>{rdv.title}</td>
                  </tr>
                  <tr>
                    <td>Description</td>
                    <td>{rdv.description}</td>
                  </tr>
                  <tr>
                    <td>Lieu</td>
                    <td>{rdv.place}</td>
                  </tr>
                  <tr>
                    <td>Journée complète</td>
                    <td>{rdv.fullTime ? 'Oui' : 'Non'}</td>
                  </tr>
                  <tr>
                    <td>Date de début</td>
                    <td>{moment(rdv.startDateTime).format('ddd DD MMM YYYY, HH:mm')}</td>
                  </tr>
                  {!rdv.fullTime && (
                    <tr>
                      <td>Date de fin</td>
                      <td>{moment(rdv.endDatetime).format('ddd DD MMM YYYY, HH:mm')}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className={styles.modal_footer}>
            <div className={styles.buttons_container}>
              <button className="btn btn-secondary" onClick={onClose}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      </ReactModal>
      <Outlet />
    </>
  );
}
