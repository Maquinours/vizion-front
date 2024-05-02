import { createColumnHelper } from '@tanstack/react-table';
import CurrencyFormat from '../../../../../../../../components/CurrencyFormat/CurrencyFormat';
import SaleDataRowResponseDto from '../../../../../../../../utils/types/SaleDataRowResponseDto';
import TableComponent from '../../../../../../../../components/Table/Table';
import { useQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { getRouteApi } from '@tanstack/react-router';
import styles from './Table.module.scss';
import _ from 'lodash';

const routeApi = getRouteApi('/app/tools/global-turnover');

const columnHelper = createColumnHelper<SaleDataRowResponseDto>();
const columns = [
  columnHelper.display({
    header: 'Représentant',
    cell: ({ row: { original } }) => <span>{original.enterpriseName}</span>,
  }),
  columnHelper.display({
    header: 'Janvier',
    cell: ({ row: { original } }) => <CurrencyFormat value={original.jan} defaultValue={0} />,
  }),
  columnHelper.display({
    header: 'Février',
    cell: ({ row: { original } }) => <CurrencyFormat value={original.feb} defaultValue={0} />,
  }),
  columnHelper.display({
    header: 'Mars',
    cell: ({ row: { original } }) => <CurrencyFormat value={original.mar} defaultValue={0} />,
  }),
  columnHelper.display({
    header: 'Avril',
    cell: ({ row: { original } }) => <CurrencyFormat value={original.apr} defaultValue={0} />,
  }),
  columnHelper.display({
    header: 'Mai',
    cell: ({ row: { original } }) => <CurrencyFormat value={original.mai} defaultValue={0} />,
  }),
  columnHelper.display({
    header: 'Juin',
    cell: ({ row: { original } }) => <CurrencyFormat value={original.jun} defaultValue={0} />,
  }),
  columnHelper.display({
    header: 'Juillet',
    cell: ({ row: { original } }) => <CurrencyFormat value={original.jul} defaultValue={0} />,
  }),
  columnHelper.display({
    header: 'Aout',
    cell: ({ row: { original } }) => <CurrencyFormat value={original.aug} defaultValue={0} />,
  }),
  columnHelper.display({
    header: 'Septembre',
    cell: ({ row: { original } }) => <CurrencyFormat value={original.sep} defaultValue={0} />,
  }),
  columnHelper.display({
    header: 'Octobre',
    cell: ({ row: { original } }) => <CurrencyFormat value={original.oct} defaultValue={0} />,
  }),
  columnHelper.display({
    header: 'Novembre',
    cell: ({ row: { original } }) => <CurrencyFormat value={original.nov} defaultValue={0} />,
  }),
  columnHelper.display({
    header: 'Décembre',
    cell: ({ row: { original } }) => <CurrencyFormat value={original.dec} defaultValue={0} />,
  }),
  columnHelper.display({
    header: 'Total',
    cell: ({ row: { original } }) => <CurrencyFormat value={original.total} defaultValue={0} />,
  }),
];

export default function AppViewToolsViewGlobalTurnoverViewTableComponent() {
  const { year } = routeApi.useSearch();

  const { data, isLoading } = useQuery({ ...queries.turnovers.detail(year), select: (data) => _.sortBy(Object.values(data), [(o) => o.enterpriseName]) });

  return (
    <div className={styles.table_container}>
      <TableComponent columns={columns} data={data} isLoading={isLoading} />
    </div>
  );
}
