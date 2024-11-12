import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import moment from 'moment';
import ReactModal from 'react-modal';
import { queries } from '../../../../../../utils/constants/queryKeys';
import styles from './SchedulerEventDetailsModal.module.scss';

const Route = getRouteApi('/app/dashboard/scheduler-event-details/$eventId');

export default function AppViewDashboardViewSchedulerEventDetailsModalView() {
  const navigate = useNavigate();

  const { eventId } = Route.useParams();

  const { data: event } = useSuspenseQuery({
    ...queries['rdv-user-infos'].list._ctx.byRdvId(eventId),
    select: (data) => ({
      rdv: data.at(0)!.rdv!,
      participants: data.map((info) => ({ id: info.attributeToId, firstName: info.attributeToFirstName, lastName: info.attributeToLastName })),
    }),
  });

  const onClose = () => {
    navigate({ from: Route.id, to: '../..', search: true, replace: true, resetScroll: false });
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.event_modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_header}>
          <div className={styles.modal_title}>
            <p>Détail du rendez-vous</p>
          </div>
        </div>
        <div className={styles.modal_content}>
          <div className={styles.table_container}>
            <table>
              <tbody>
                <tr>
                  <td>Participants (s)</td>
                  <td>
                    <ul style={{ listStyle: 'inside' }}>
                      {event.participants.map((item) => (
                        <li
                          style={{
                            color: '#F24C52',
                            marginBottom: '2px',
                          }}
                          key={item.id}
                        >
                          {item.firstName} {item.lastName}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td>Titre</td>
                  <td>{event.rdv.title}</td>
                </tr>
                <tr>
                  <td>Description</td>
                  <td>{event.rdv.description}</td>
                </tr>
                <tr>
                  <td>Lieu</td>
                  <td>{event.rdv.place}</td>
                </tr>
                <tr>
                  <td>Journée complète</td>
                  <td>{event.rdv.fullTime ? 'Oui' : 'Non'}</td>
                </tr>
                <tr>
                  <td>Date de début</td>
                  <td>{moment(event.rdv.startDateTime).format('ddd DD MMM YYYY, HH:mm')}</td>
                </tr>
                {!event.rdv.fullTime && (
                  <tr>
                    <td>Date de fin</td>
                    <td>{moment(event.rdv.endDatetime).format('ddd DD MMM YYYY, HH:mm')}</td>
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
  );
}
