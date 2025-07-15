import { VirtualElement } from '@popperjs/core';
import { Row, createColumnHelper } from '@tanstack/react-table';
import React, { useState } from 'react';
import AssistanceResponseDto from '../../../../../../utils/types/AssistanceResponseDto';
import AssistanceSupportDetailResponseDto from '../../../../../../utils/types/AssistanceSupportDetailResponseDto';
import TableComponent from '../../../../../Table/Table';
import AppViewRmaViewSupportViewTableComponentContextMenuComponent from './components/ContextMenu/ContextMenu';
import styles from './Table.module.scss';

// const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/support');

const columnHelper = createColumnHelper<AssistanceSupportDetailResponseDto>();
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
    header: 'Problème décrit',
    cell: ({ row: { original } }) => original.issue,
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

type RmaModalComponentSupportComponentTableComponentProps = Readonly<{
  rma: AssistanceResponseDto;
}>;
export default function RmaModalComponentSupportComponentTableComponent({ rma }: RmaModalComponentSupportComponentTableComponentProps) {
  // const { rmaId } = routeApi.useParams();

  const [contextMenuAnchor, setContextMenuAnchor] = useState<VirtualElement>();
  const [selectedItem, setSelectedItem] = useState<AssistanceSupportDetailResponseDto>();

  // const { data: rma } = useSuspenseQuery(queries.rmas.detail(rmaId));

  const onRowContextMenu = (e: React.MouseEvent, row: Row<AssistanceSupportDetailResponseDto>) => {
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
        <TableComponent columns={columns} data={rma.assistanceSupport?.details ?? undefined} onRowContextMenu={onRowContextMenu} />
      </div>
      <AppViewRmaViewSupportViewTableComponentContextMenuComponent
        anchorElement={contextMenuAnchor}
        setAnchorElement={setContextMenuAnchor}
        item={selectedItem}
      />
    </>
  );
}
