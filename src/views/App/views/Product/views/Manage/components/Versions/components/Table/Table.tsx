import { VirtualElement } from '@popperjs/core';
import { Row, createColumnHelper } from '@tanstack/react-table';
import { useState } from 'react';
import CurrencyFormat from '../../../../../../../../../../components/CurrencyFormat/CurrencyFormat';
import TableComponent from '../../../../../../../../../../components/Table/Table';
import { formatDateWithSlash } from '../../../../../../../../../../utils/functions/dates';
import ProductVersionResponseDto from '../../../../../../../../../../utils/types/ProductVersionResponseDto';
import AppViewProductViewManageViewVersionsComponentTableComponentContextMenuComponent from './components/ContextMenu/ContextMenu';
import styles from './Table.module.scss';

const columnHelper = createColumnHelper<ProductVersionResponseDto>();
const columns = [
  columnHelper.display({
    id: 'image',
    cell: ({ row: { original } }) => (
      <img
        src={`https://bd.vizeo.eu/6-Photos/${original.product?.reference}/MINI_${original.product?.reference}.jpg`}
        height={25}
        alt={`Produit ${original.product?.reference}`}
      />
    ),
  }),
  columnHelper.display({
    header: 'Référence',
    cell: ({ row: { original } }) => original.reference,
  }),
  columnHelper.display({
    header: 'Fournisseur',
    cell: ({ row: { original } }) => original.providerName ?? 'Aucun fournisseur',
  }),
  columnHelper.display({
    header: 'Prix public',
    cell: ({ row: { original } }) => <CurrencyFormat value={original.publicPrice} />,
  }),
  columnHelper.display({
    header: "Date d'ajout",
    cell: ({ row: { original } }) => `Le ${formatDateWithSlash(original.createdDate)}`,
  }),
];

type AppViewProductViewManageViewVersionsComponentTableComponentProps = Readonly<{
  isLoading: boolean;
  data: Array<ProductVersionResponseDto> | undefined;
}>;
export default function AppViewProductViewManageViewVersionsComponentTableComponent({
  isLoading,
  data,
}: AppViewProductViewManageViewVersionsComponentTableComponentProps) {
  const [productVersion, setProductVersion] = useState<ProductVersionResponseDto>();
  const [contextMenuAnchor, setContextMenuAnchor] = useState<VirtualElement | undefined>();

  const onRowContextMenu = (e: React.MouseEvent, row: Row<ProductVersionResponseDto>) => {
    e.preventDefault();
    setProductVersion(row.original);
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
  };

  return (
    <>
      <div className={styles.container}>
        <TableComponent isLoading={isLoading} data={data} columns={columns} rowId="id" onRowContextMenu={onRowContextMenu} />
      </div>
      <AppViewProductViewManageViewVersionsComponentTableComponentContextMenuComponent
        anchorElement={contextMenuAnchor}
        setAnchorElement={setContextMenuAnchor}
        version={productVersion}
      />
    </>
  );
}
