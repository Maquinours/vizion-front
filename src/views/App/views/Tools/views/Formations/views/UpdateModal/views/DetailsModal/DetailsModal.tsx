import { getRouteApi } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { useContext, useMemo } from 'react';
import { FaTrash } from 'react-icons/fa';
import ReactModal from 'react-modal';
import TableComponent from '../../../../../../../../../../components/Table/Table';
import { FormationDetail, UpdateFormationDetailsContext } from '../../utils/contexts/context';
import styles from './DetailsModal.module.scss';

const routeApi = getRouteApi('/app/tools/formations/update/$formationId/details');

const columnHelper = createColumnHelper<FormationDetail>();

export default function AppViewToolsViewFormationsViewUpdateModalViewDetailsModalView() {
  const navigate = routeApi.useNavigate();

  const { details, setDetails } = useContext(UpdateFormationDetailsContext)!;

  const columns = useMemo(
    () => [
      columnHelper.display({ header: 'Titre', cell: ({ row: { original } }) => original.title }),
      columnHelper.display({
        header: 'Date et Heure',
        cell: ({ row: { original } }) => {
          const date = new Date(original.formationDate);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const day = date.getDate();
          const startHour = Number(original.startTime?.split(':')[0]);
          const endHour = Number(original.endTime?.split(':')[0]);
          const currentStartTime = new Date(year, month, day, startHour);
          const currentEndTime = new Date(year, month, day, endHour);
          return (
            <div>
              {format(new Date(original?.formationDate), 'cccc, dd MMMM yyyy', {
                locale: fr,
              })}{' '}
              {format(new Date(currentStartTime), 'HH')}h - {format(new Date(currentEndTime), 'HH')}h
            </div>
          );
        },
      }),
      columnHelper.display({
        header: 'Formateurs',
        cell: ({ row: { original } }) => (
          <div className={styles.trainers_list}>
            <ul>
              {original?.trainers?.map((item) => (
                <li key={item.id}>{item.name}</li>
              ))}
            </ul>
          </div>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        cell: ({ row: { index } }) => (
          <div className={styles.action_buttons}>
            <button onClick={() => setDetails(details.filter((_, ind) => index !== ind))}>
              <FaTrash width="18" height="18" color="#F24C52" />
            </button>
          </div>
        ),
      }),
    ],
    [details, setDetails],
  );

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.container}>
        <div className={styles.title}>
          <p>Details de la formation</p>
        </div>

        <div className={styles.content}>
          <div className={styles.table_container}>
            <TableComponent columns={columns} data={details} />
          </div>

          <div className={styles.footer_buttons}>
            <button className="btn btn-secondary" onClick={() => onClose()}>
              Valider
            </button>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
