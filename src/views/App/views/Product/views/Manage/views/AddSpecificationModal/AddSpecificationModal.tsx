import { useQuery } from '@tanstack/react-query';
import { Link, Outlet, getRouteApi } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import ReactModal from 'react-modal';
import TableComponent from '../../../../../../../../components/Table/Table';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import AdvancedProductSpecificationResponseDto from '../../../../../../../../utils/types/AdvancedProductSpecificationResponseDto';
import styles from './AddSpecificationModal.module.scss';
import _ from 'lodash';

const route = '/app/products/$productId/manage/add-specification';
const routeApi = getRouteApi('/app/products_/$productId/manage/add-specification');

const columnHelper = createColumnHelper<AdvancedProductSpecificationResponseDto>();
const columns = [
  columnHelper.display({
    header: 'Nom',
    cell: ({ row: { original } }) => (
      <Link from={route} to="$filterId" params={{ filterId: original.id }} search replace resetScroll={false} preload="intent">
        {original.name}
      </Link>
    ),
  }),
  columnHelper.display({
    header: 'Description',
    cell: ({ row: { original } }) => (
      <Link from={route} to="$filterId" params={{ filterId: original.id }} search replace resetScroll={false} preload="intent">
        {original.type}
      </Link>
    ),
  }),
  columnHelper.display({
    header: 'Unité',
    cell: ({ row: { original } }) => (
      <Link from={route} to="$filterId" params={{ filterId: original.id }} search replace resetScroll={false} preload="intent">
        {original.unit}
      </Link>
    ),
  }),
];

export default function AppViewProductViewManageViewAddSpecificationModalView() {
  const navigate = routeApi.useNavigate();

  const { data, isLoading } = useQuery({...queries['product-filter'].list, select: (data) => _.sortBy(data, 'name') });

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  return (
    <>
      <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
        <div className={styles.modal_container}>
          <div className={styles.modal_title}>
            <h6>Ajouter des caractéristiques</h6>
          </div>

          <div className={styles.table}>
            <div className={styles.container}>
              <TableComponent isLoading={isLoading} data={data} columns={columns} rowId="id" />
            </div>
          </div>
          <div className={styles.buttons_container}>
            <button className="btn btn-primary-light" onClick={onClose}>
              Annuler
            </button>
          </div>
        </div>
      </ReactModal>
      <Outlet />
    </>
  );
}
