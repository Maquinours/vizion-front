import { Link, Outlet, getRouteApi } from '@tanstack/react-router';
import styles from './VvaList.module.scss';
import { createColumnHelper } from '@tanstack/react-table';
import SalesVvaResponseDto from '../../../../../../utils/types/SalesVvaResponseDto';
import CurrencyFormat from '../../../../../../components/CurrencyFormat/CurrencyFormat';
import { FaTrash } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../utils/constants/queryKeys';
import PaginationComponent from '../../../../../../components/Pagination/Pagination';
import TableComponent from '../../../../../../components/Table/Table';

const formatDate = (month: number, year: number) => {
  const date = new Date();
  date.setMonth(month - 1);
  date.setFullYear(year);

  return date.toLocaleString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });
};

const routeApi = getRouteApi('/app/tools/vva');

const size = 15;

const columnHelper = createColumnHelper<SalesVvaResponseDto>();
const columns = [
  columnHelper.display({
    header: 'Livré à',
    cell: ({ row: { original } }) => <p>{original.enterpriseName}</p>,
  }),
  columnHelper.display({
    header: 'Adresse',
    cell: ({ row: { original } }) => <p>{original.address}</p>,
  }),
  columnHelper.display({
    header: 'Code Postal',
    cell: ({ row: { original } }) => <p>{original.zipCode}</p>,
  }),
  columnHelper.display({
    header: 'Montant HT',
    cell: ({ row: { original } }) => <CurrencyFormat value={original.amountHt} />,
  }),
  columnHelper.display({
    header: 'Affecté à',
    cell: ({ row: { original } }) => <p>{original.representativeName}</p>,
  }),
  columnHelper.display({
    header: 'Période',
    cell: ({ row: { original } }) => <p>{formatDate(original.month, original.year)}</p>,
  }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row: { original } }) => (
      <Link from={routeApi.id} to="delete/$vvaId" params={{ vvaId: original.id }} search={(old) => old} replace className={styles.tooltip}>
        <FaTrash size="18px" color="#F24C52" />
      </Link>
    ),
  }),
];

export default function AppViewToolsViewVvaListView() {
  const { page } = routeApi.useSearch();

  const { data, isLoading } = useQuery(queries['sales-vva'].page({ page, size }));

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.buttons_container}>
            <Link from={routeApi.id} to="create" search={(old) => old} replace className="btn btn-secondary">
              Ajouter
            </Link>
          </div>
          <div className={styles.table_container}>
            <TableComponent columns={columns} data={data?.content} isLoading={isLoading} />
            <PaginationComponent
              page={page}
              totalPages={data?.totalPages}
              pageLink={(page) => ({ from: routeApi.id, search: (old) => ({ ...old, page }), replace: true })}
            />
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}
