import { createColumnHelper } from '@tanstack/react-table';
import TableComponent from '../../../../../../components/Table/Table';
import ProductResponseDto from '../../../../../../utils/types/ProductResponseDto';
import { Link, getRouteApi } from '@tanstack/react-router';
import TableRowExpandButtonComponent from '../../../../../../components/TableRowExpandButton/TableRowExpandButton';
import CurrencyFormat from '../../../../../../components/CurrencyFormat/CurrencyFormat';
import AmountFormat from '../../../../../../components/AmountFormat/AmountFormat';
import styles from './Table.module.scss';
import AppViewProductsViewTableComponentSubRowComponent from './components/SubRow/SubRow';

const routeApi = getRouteApi('/app/products');

const columnHelper = createColumnHelper<ProductResponseDto>();
const columns = [
  columnHelper.display({
    id: 'image',
    cell: ({ row: { original } }) => (
      <img src={`https://bd.vizeo.eu/6-Photos/${original.reference}/MINI_${original.reference}.jpg`} alt={`Produit ${original.reference}`} />
    ),
  }),
  columnHelper.display({
    header: 'Référence',
    cell: ({ row: { original } }) => (
      <Link from={routeApi.id} to="$productId/informations" params={{ productId: original.id }} replace>
        {original.reference}
      </Link>
    ),
  }),
  columnHelper.display({
    header: 'Désignation courte',
    cell: ({ row: { original } }) => original.shortDescription,
  }),
  columnHelper.display({
    id: 'expand',
    cell: TableRowExpandButtonComponent,
  }),
  columnHelper.display({
    header: 'Prix public',
    cell: ({ row: { original } }) => <CurrencyFormat value={original.publicPrice} />,
  }),
  columnHelper.display({
    header: 'Stock',
    cell: ({ row: { original } }) => (original.virtualQty ? '-' : <AmountFormat value={original.qty} />),
  }),
];

type AppViewProductsViewTableComponentProps = Readonly<{
  data: Array<ProductResponseDto> | undefined;
  isLoading: boolean;
}>;
export default function AppViewProductsViewTableComponent({ data, isLoading }: AppViewProductsViewTableComponentProps) {
  return (
    <div className={styles.table_container}>
      <TableComponent
        columns={columns}
        data={data}
        isLoading={isLoading}
        getRowCanExpand={(row) => row.original.associatedProduct !== null && row.original.associatedProduct.length > 0}
        renderSubComponent={AppViewProductsViewTableComponentSubRowComponent}
        rowId="id"
      />
    </div>
  );
}
