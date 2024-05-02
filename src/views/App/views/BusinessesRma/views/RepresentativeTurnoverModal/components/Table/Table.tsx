import { createColumnHelper } from '@tanstack/react-table';
import SalesVvaResponseDto from '../../../../../../../../utils/types/SalesVvaResponseDto';
import CurrencyFormat from '../../../../../../../../components/CurrencyFormat/CurrencyFormat';
import TableComponent from '../../../../../../../../components/Table/Table';
import styles from './Table.module.scss';

const columnHelper = createColumnHelper<SalesVvaResponseDto>();

const columns = [
  columnHelper.display({
    header: "Numéro d'affaire",
    cell: ({ row: { original } }) => original.businessNumber,
  }),
  columnHelper.display({
    header: 'Entreprise',
    cell: ({ row: { original } }) => original.enterpriseName,
  }),
  columnHelper.display({
    header: 'Adresse de livraison',
    cell: ({ row: { original } }) => `${original.address} (${original.zipCode})`,
  }),
  columnHelper.display({
    header: 'Montant HT',
    cell: ({ row: { original } }) => <CurrencyFormat value={original.amountHt} />,
  }),
  columnHelper.display({
    header: 'Type',
    cell: ({ row: { original } }) => original.type,
  }),
];

type AppViewBusinessesRmaViewRepresentativeTurnoverModalViewTableComponentProps = Readonly<{
  data: Array<SalesVvaResponseDto> | undefined;
  isLoading: boolean;
}>;
export default function AppViewBusinessesRmaViewRepresentativeTurnoverModalViewTableComponent({
  data,
  isLoading,
}: AppViewBusinessesRmaViewRepresentativeTurnoverModalViewTableComponentProps) {
  return (
    <div className={styles.table_container}>
      <TableComponent columns={columns} data={data} isLoading={isLoading} />
    </div>
  );
}
