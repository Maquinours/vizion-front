import { Row, createColumnHelper } from '@tanstack/react-table';
import AssistanceReceptionDetailResponseDto from '../../../../../../../../utils/types/AssistanceReceptionDetailResponseDto';
import styles from './Table.module.scss';
import TableComponent from '../../../../../../../../components/Table/Table';
import { getRouteApi } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { VirtualElement } from '@popperjs/core';
import { useState } from 'react';
import AppViewRmaViewReceptionViewTableComponentContextMenuComponent from './ContextMenu/ContextMenu';

const routeApi = getRouteApi('/app/businesses-rma/rma/$rmaId/reception');

const columnHelper = createColumnHelper<AssistanceReceptionDetailResponseDto>();
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
    header: "Numéro d'affaire",
    cell: ({ row: { original } }) => original.businessNum,
  }),
  columnHelper.display({
    header: 'Prise sous garantie',
    cell: ({ row: { original } }) => (original.warranty ? 'Oui' : 'Non'),
  }),
  columnHelper.display({
    header: 'Problème décrit',
    cell: ({ row: { original } }) => original.issue,
  }),
  columnHelper.display({
    header: 'Commentaire',
    cell: ({ row: { original } }) => original.externalComment,
  }),
  columnHelper.display({
    header: 'Commentaire interne',
    cell: ({ row: { original } }) => original.internalComment,
  }),
  //   {
  //     header: '',
  //     id: 'more',
  //     accessorKey: 'more',
  //     cell: ({ row: { original } }) => {
  //       if (currentRma?.state !== 'ARCHIVE') {
  //         return (
  //           <div className={styles.tooltip}>
  //             <BsThreeDotsVertical />
  //             <div className={styles.content}>
  //               <Menu currentDetail={original} openDeleteModal={openDeleteModal} openUpdateModal={openUpdateModal} />
  //             </div>
  //           </div>
  //         );
  //       }
  //     },
  //   },
];

export default function AppViewRmaViewReceptionViewTableComponent() {
  const [contextMenuAnchor, setContextMenuAnchor] = useState<VirtualElement>();
  const [selectedItem, setSelectedItem] = useState<AssistanceReceptionDetailResponseDto>();

  const { rmaId } = routeApi.useParams();

  const { data: rma } = useSuspenseQuery(queries.rmas.detail(rmaId));

  const onRowContextMenu = (e: React.MouseEvent, row: Row<AssistanceReceptionDetailResponseDto>) => {
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
        <TableComponent columns={columns} data={rma.assistanceReception?.details ?? undefined} onRowContextMenu={onRowContextMenu} />
      </div>
      <AppViewRmaViewReceptionViewTableComponentContextMenuComponent
        anchorElement={contextMenuAnchor}
        setAnchorElement={setContextMenuAnchor}
        item={selectedItem}
      />
    </>
  );
}
