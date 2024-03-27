import { Row, createColumnHelper } from '@tanstack/react-table';
import TableComponent from '../../../../../../../../../../components/Table/Table';
import ProductVersionShelfStockResponseDto from '../../../../../../../../../../utils/types/ProductVersionShelfStockResponseDto';
import AmountFormat from '../../../../../../../../../../components/AmountFormat/AmountFormat';
import styles from './Table.module.scss';
import AppViewProductViewManageViewStocksComponentTableComponentContextMenuComponent from './ContextMenu/ContextMenu';
import { useCallback, useState } from 'react';
import { VirtualElement } from '@popperjs/core';

const columnHelper = createColumnHelper<ProductVersionShelfStockResponseDto>();
const columns = [
  columnHelper.display({
    id: 'image',
    cell: ({ row: { original } }) =>
      !!original.reference && (
        <img
          src={`https://raw.githubusercontent.com/VizeoInc/6-Photos/main/${original.reference}/MINI_${original.reference}.jpg`}
          height={25}
          alt={`Produit ${original.reference}`}
        />
      ),
  }),
  columnHelper.display({
    header: 'Référence',
    cell: ({ row: { original } }) => original.versionReference,
  }),
  columnHelper.display({
    header: 'Quantité',
    cell: ({ row: { original } }) => <AmountFormat value={original.currentStock} />,
  }),
  columnHelper.display({
    header: 'Etagère',
    cell: ({ row: { original } }) => original.productVersionShelf?.number,
  }),
];

type AppViewProductViewManageViewStocksComponentTableComponentProps = Readonly<{
  isLoading: boolean;
  data: Array<ProductVersionShelfStockResponseDto> | undefined;
}>;
export default function AppViewProductViewManageViewStocksComponentTableComponent({
  isLoading,
  data,
}: AppViewProductViewManageViewStocksComponentTableComponentProps) {
  const [contextMenuAnchor, setContextMenuAnchor] = useState<VirtualElement>();
  const [stock, setStock] = useState<ProductVersionShelfStockResponseDto>();

  const onRowContextMenu = useCallback((e: React.MouseEvent, row: Row<ProductVersionShelfStockResponseDto>) => {
    e.preventDefault();
    setStock(row.original);
    setContextMenuAnchor({
      getBoundingClientRect: () => ({
        width: 0,
        height: 0,
        x: e.clientX,
        y: e.clientY,
        top: e.clientY,
        right: e.clientX,
        bottom: e.clientY,
        left: e.clientX,
        toJSON: () => {},
      }),
    });
  }, []);

  return (
    <>
      <div className={styles.container}>
        <TableComponent isLoading={isLoading} data={data} columns={columns} rowId="id" onRowContextMenu={onRowContextMenu} />
      </div>
      <AppViewProductViewManageViewStocksComponentTableComponentContextMenuComponent
        anchorElement={contextMenuAnchor}
        setAnchorElement={setContextMenuAnchor}
        stock={stock}
      />
    </>
  );
}
