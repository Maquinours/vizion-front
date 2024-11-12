import { createColumnHelper } from '@tanstack/react-table';
import TableComponent from '../../../../../../../../components/Table/Table';
import ProductVersionShelfStockResponseDto from '../../../../../../../../utils/types/ProductVersionShelfStockResponseDto';
import styles from './Table.module.scss';
import AmountFormat from '../../../../../../../../components/AmountFormat/AmountFormat';
import { useMemo } from 'react';
import { HiPencilAlt } from 'react-icons/hi';
import { Link, getRouteApi } from '@tanstack/react-router';

const routeApi = getRouteApi('/app/tools/product-inventory');

const columnHelper = createColumnHelper<{ stock: ProductVersionShelfStockResponseDto; comptedStock: number }>();

type AppViewToolsViewProductInventoryViewTableComponentProps = Readonly<{
  data: Array<{ stock: ProductVersionShelfStockResponseDto; comptedStock: number }>;
  isLoading: boolean;
  setComptedNumber: (index: number, value: number) => void;
}>;
export default function AppViewToolsViewProductInventoryViewTableComponent({
  data,
  isLoading,
  setComptedNumber,
}: AppViewToolsViewProductInventoryViewTableComponentProps) {
  const columns = useMemo(
    () => [
      columnHelper.display({
        header: 'Étagère',
        cell: ({ row: { original } }) => original.stock.productVersionShelf?.number,
      }),
      columnHelper.display({
        header: 'Produit',
        cell: ({ row: { original } }) => original.stock.reference,
      }),
      columnHelper.display({
        header: 'Version',
        cell: ({ row: { original } }) => original.stock.versionReference,
      }),
      columnHelper.display({
        header: 'Quantité comptée',
        cell: ({ row: { original, index } }) => (
          <AmountFormat value={original.comptedStock} displayType="input" onChange={(e) => setComptedNumber(index, Number(e.target.value))} />
        ),
      }),
      columnHelper.display({
        header: 'Quantité théorique',
        cell: ({ row: { original } }) => <AmountFormat value={original.stock.currentStock} />,
      }),
      columnHelper.display({
        id: 'actions',
        cell: ({ row: { original } }) => (
          <Link from={routeApi.id} to="update/$stockId" params={{ stockId: original.stock.id }} search replace resetScroll={false}>
            <HiPencilAlt />
          </Link>
        ),
      }),
    ],
    [setComptedNumber],
  );

  return (
    <div className={styles.table_container}>
      <TableComponent columns={columns} data={data} isLoading={isLoading} />
    </div>
  );
}
