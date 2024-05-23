import { useQuery } from '@tanstack/react-query';
import { Link, Outlet, getRouteApi, useNavigate } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import { FaTrash } from 'react-icons/fa';
import ReactModal from 'react-modal';
import TableComponent from '../../../../../../../../components/Table/Table';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import FormationSubscriptionResponseDto from '../../../../../../../../utils/types/FormationSubscriptionResponseDto';
import styles from './SubscribersModal.module.scss';

const routeApi = getRouteApi('/app/tools/formations/subscribers/$formationDetailId');

const columnHelper = createColumnHelper<FormationSubscriptionResponseDto>();
const columns = [
  columnHelper.display({
    header: 'Nom complet',
    cell: ({ row: { original } }) => `${original.firstName} ${original.lastName}`,
  }),
  columnHelper.display({
    header: 'Email',
    cell: ({ row: { original } }) => (
      <Link from={routeApi.id} to="send-email/$subscriptionId" params={{ subscriptionId: original.id }} search={(old) => old} replace resetScroll={false}>
        {original.email}
      </Link>
    ),
  }),
  columnHelper.display({
    header: 'Téléphone',
    cell: ({ row: { original } }) => <a href={`tel:${original.phoneNumber}`}>{original.phoneNumber}</a>,
  }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row: { original } }) => (
      <div className={styles.action_buttons}>
        <Link from={routeApi.id} to="delete/$subscriptionId" params={{ subscriptionId: original.id }} search={(old) => old} replace resetScroll={false}>
          <FaTrash width="25" height="25" color="#F24C52" />
        </Link>
      </div>
    ),
  }),
];

export default function AppViewToolsViewFormationsViewSubscribersModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { formationDetailId } = routeApi.useParams();

  const { data, isLoading } = useQuery(queries['formation-subscriptions'].list._ctx.byFormationDetailId(formationDetailId));

  const onClose = () => {
    navigate({ to: '../..', search: (old) => old, replace: true });
  };

  return (
    <>
      <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
        <div className={styles.modal_container}>
          <div className={styles.modal_title}>
            <h6>Liste des participants</h6>
          </div>
          <div className={styles.buttons}>
            <Link from={routeApi.id} to="create" search={(old) => old} replace resetScroll={false} className="btn btn-primary">
              Ajouter un participant
            </Link>
          </div>
          <div className={styles.table_container}>
            <TableComponent columns={columns} data={data} isLoading={isLoading} />
          </div>
          <div className={styles.modal_buttons}>
            <button className="btn btn-secondary" onClick={() => onClose()}>
              Fermer
            </button>
          </div>
        </div>
      </ReactModal>
      <Outlet />
    </>
  );
}
