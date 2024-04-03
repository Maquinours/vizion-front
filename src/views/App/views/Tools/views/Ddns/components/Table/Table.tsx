import { Row, createColumnHelper } from '@tanstack/react-table';
import { formatDateWithSlash } from '../../../../../../../../utils/functions/dates';
import DnsEntryResponseDto from '../../../../../../../../utils/types/DnsEntryResponseDto';
import TableComponent from '../../../../../../../../components/Table/Table';
import styles from './Table.module.scss';
import AppViewToolsViewDdnsViewTableComponentContextMenuComponent from './components/ContextMenu/ContextMenu';
import { useState } from 'react';
import { VirtualElement } from '@popperjs/core';

const columnHelper = createColumnHelper<DnsEntryResponseDto>();
const columns = [
  columnHelper.display({
    header: 'Date',
    cell: ({ row: { original } }) => formatDateWithSlash(original.createdDate),
  }),
  columnHelper.display({
    header: 'Nom de domaine',
    cell: ({ row: { original } }) => original.domainName,
  }),
  columnHelper.display({
    header: 'Url',
    cell: ({ row: { original } }) => original.url,
  }),
  columnHelper.display({
    header: 'Mail associé',
    cell: ({ row: { original } }) => original.email,
  }),
  columnHelper.display({
    header: 'Numéro de série',
    cell: ({ row: { original } }) => original.productSerialNumber,
  }),
  columnHelper.display({
    header: 'Référence',
    cell: ({ row: { original } }) => original.productReference,
  }),
  columnHelper.display({
    header: 'Créée par',
    cell: ({ row: { original } }) => original.profileName,
  }),
];

type AppViewToolsViewDdnsViewTableComponentProps = Readonly<{
  data: Array<DnsEntryResponseDto> | undefined;
  isLoading: boolean;
}>;
export default function AppViewToolsViewDdnsViewTableComponent({ data, isLoading }: AppViewToolsViewDdnsViewTableComponentProps) {
  const [contextMenuAnchor, setContextMenuAnchor] = useState<VirtualElement>();
  const [selectedItem, setSelectedItem] = useState<DnsEntryResponseDto>();

  const onRowContextMenu = (e: React.MouseEvent, row: Row<DnsEntryResponseDto>) => {
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
        <TableComponent columns={columns} data={data} isLoading={isLoading} onRowContextMenu={onRowContextMenu} />
      </div>
      <AppViewToolsViewDdnsViewTableComponentContextMenuComponent
        anchorElement={contextMenuAnchor}
        setAnchorElement={setContextMenuAnchor}
        ddns={selectedItem}
      />
    </>
  );
}
