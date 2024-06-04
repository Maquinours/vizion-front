import { VirtualElement } from '@popperjs/core';
import { Row, createColumnHelper } from '@tanstack/react-table';
import { useState } from 'react';
import TableComponent from '../../../../../../../../components/Table/Table';
import AssistanceDeliveryDetailResponseDto from '../../../../../../../../utils/types/AssistanceDeliveryDetailResponseDto';
import AssistanceResponseDto from '../../../../../../../../utils/types/AssistanceResponseDto';
import styles from './Table.module.scss';
import AppViewRmaViewReceptionViewTableComponentContextMenuComponent from './components/ContextMenu/ContextMenu';

const columnHelper = createColumnHelper<AssistanceDeliveryDetailResponseDto>();
const columns = [
  columnHelper.display({
    header: 'Référence',
    cell: ({ row: { original } }) => original.productRef,
  }),
  columnHelper.display({
    header: 'Numéro de série',
    cell: ({ row: { original } }) => original.productSerialNumber,
  }),
  columnHelper.display({
    header: 'Affaire',
    cell: ({ row: { original } }) => original.businessNum,
  }),
  columnHelper.display({
    header: 'Sous garantie',
    cell: ({ row: { original } }) => (original.warranty ? 'Oui' : 'Non'),
  }),
  columnHelper.display({
    header: 'Problème décrit',
    cell: ({ row: { original } }) => original.issue,
  }),
  columnHelper.display({
    header: 'Constaté',
    cell: ({ row: { original } }) => (original.found ? 'Oui' : 'Non'),
  }),
  columnHelper.display({
    header: 'Solution appliquée',
    cell: ({ row: { original } }) => original.solution,
  }),
  columnHelper.display({
    header: 'Commentaire interne',
    cell: ({ row: { original } }) => original.internalComment,
  }),
];

type AppViewRmaViewDeliveryViewTableComponentProps = Readonly<{
  rma: AssistanceResponseDto;
}>;
export default function AppViewRmaViewDeliveryViewTableComponent({ rma }: AppViewRmaViewDeliveryViewTableComponentProps) {
  const [contextMenuAnchor, setContextMenuAnchor] = useState<VirtualElement>();
  const [selectedItem, setSelectedItem] = useState<AssistanceDeliveryDetailResponseDto>();

  const onRowContextMenu = (e: React.MouseEvent, row: Row<AssistanceDeliveryDetailResponseDto>) => {
    e.preventDefault();
    setSelectedItem(row.original);
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
      <div className={styles.table_container}>
        <TableComponent columns={columns} data={rma.assistanceDelivery?.details ?? undefined} onRowContextMenu={onRowContextMenu} />
      </div>
      <AppViewRmaViewReceptionViewTableComponentContextMenuComponent
        anchorElement={contextMenuAnchor}
        setAnchorElement={setContextMenuAnchor}
        item={selectedItem}
      />
    </>
  );
}
