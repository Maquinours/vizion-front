import { Link, getRouteApi } from '@tanstack/react-router';
import { Row, createColumnHelper } from '@tanstack/react-table';
import { useCallback } from 'react';
import AmountFormat from '../../../../../../components/AmountFormat/AmountFormat';
import CurrencyFormat from '../../../../../../components/CurrencyFormat/CurrencyFormat';
import TableComponent from '../../../../../../components/Table/Table';
import TableRowExpandButtonComponent from '../../../../../../components/TableRowExpandButton/TableRowExpandButton';
import ProductResponseDto from '../../../../../../utils/types/ProductResponseDto';
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
      <Link
        from={routeApi.id}
        to="$productId"
        params={{ productId: original.id }}
        onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
      >
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
  columnHelper.display({
    id: 'scrollbar_compensator',
  }),
];

type AppViewProductsViewTableComponentProps = Readonly<{
  data: Array<ProductResponseDto> | undefined;
  isLoading: boolean;
}>;
export default function AppViewProductsViewTableComponent({ data, isLoading }: AppViewProductsViewTableComponentProps) {
  const navigate = routeApi.useNavigate();

  const onRowClick = useCallback(
    (e: React.MouseEvent, row: Row<ProductResponseDto>) => {
      if (e.metaKey || e.ctrlKey) window.open(`${window.location.origin}/app/products/${row.original.id}`, '_blank');
      else navigate({ to: '$productId', params: { productId: row.original.id } });
    },
    [navigate],
  );

  return (
    <div className={styles.table_container}>
      <TableComponent
        columns={columns}
        data={data}
        isLoading={isLoading}
        getRowCanExpand={(row) => row.original.associatedProduct !== null && row.original.associatedProduct.length > 0}
        renderSubComponent={AppViewProductsViewTableComponentSubRowComponent}
        onRowClick={onRowClick}
        rowId="id"
      />
    </div>
  );
}
