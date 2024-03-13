import { createColumnHelper } from '@tanstack/react-table';
import TableComponent from '../../../../../../components/Table/Table';
import CurrencyFormat from '../../../../../../components/CurrencyFormat/CurrencyFormat';
import SalesVvaResponseDto from '../../../../../../utils/types/SalesVvaResponseDto';
import styles from './Table.module.scss';

const columnHelper = createColumnHelper<SalesVvaResponseDto>();
const columns = [
  columnHelper.display({
    header: "Numéro d'affaire",
    cell: ({ row: { original } }) => <span>{original.businessNumber}</span>,
  }),
  columnHelper.display({
    header: 'Entreprise',
    cell: ({ row: { original } }) => <span>{original.enterpriseName}</span>,
  }),
  columnHelper.display({
    header: 'Adresse de livraison',
    cell: ({ row: { original } }) => (
      <div>
        {original.address} ({original.zipCode})
      </div>
    ),
  }),
  columnHelper.display({
    header: 'Montant HT',
    cell: ({ row: { original } }) => <CurrencyFormat value={original.amountHt} />,
  }),
  columnHelper.display({
    header: 'Type',
    cell: ({ row: { original } }) => <span>{original.type}</span>,
  }),
];

type RepresentativesTurnoverViewTableComponentProps = Readonly<{
  data: Array<SalesVvaResponseDto> | undefined;
  isLoading: boolean;
}>;
export default function RepresentativesTurnoverViewTableComponent({ data, isLoading }: RepresentativesTurnoverViewTableComponentProps) {
  return (
    <div className={styles.table_container}>
      <TableComponent columns={columns} data={data} isLoading={isLoading} rowId={'id'} />
    </div>
  );
}
