import { Row, createColumnHelper } from '@tanstack/react-table';
import ExternalLinkResponseDto from '../../../../../../../../utils/types/ExternalLinkResponseDto';
import TableRowExpandButtonComponent from '../../../../../../../../components/TableRowExpandButton/TableRowExpandButton';
import { Link } from '@tanstack/react-router';
import TableComponent from '../../../../../../../../components/Table/Table';
import styles from './Table.module.scss';
import AppViewToolsViewExternalLinksViewTableComponentSubRowComponent from './components/SubRow/SubRow';
import AppViewToolsViewExternalLinksViewTableComponentContextMenuComponent from './components/ContextMenu/ContextMenu';
import { useState } from 'react';
import { VirtualElement } from '@popperjs/core';

const columnHelper = createColumnHelper<ExternalLinkResponseDto>();
const columns = [
  columnHelper.display({
    id: 'expand',
    cell: ({ row }) => (
      <div className={styles.sub_component}>
        <TableRowExpandButtonComponent row={row} />
      </div>
    ),
  }),
  columnHelper.display({
    header: 'Titre',
    cell: ({ row: { original } }) =>
      original.targetType === 'EXTERN' ? (
        <a href={original.url!} target="_blank" rel="noreferrer">
          {original.title}
        </a>
      ) : (
        <Link to="/app/external-links/$externalLinkId" params={{ externalLinkId: original.id }}>
          {original.title}
        </Link>
      ),
  }),
  columnHelper.display({
    header: 'Lien',
    cell: ({ row: { original } }) => (
      <a href={original.url!} target="_blank" rel="noreferrer">
        {original.url}
      </a>
    ),
  }),
  columnHelper.display({
    header: 'Niveau',
    cell: ({ row: { original } }) => original.accessLevel,
  }),
];

type AppViewToolsViewExternalLinksViewTableComponentProps = Readonly<{
  data: Array<ExternalLinkResponseDto> | undefined;
  isLoading: boolean;
}>;
export default function AppViewToolsViewExternalLinksViewTableComponent({ data, isLoading }: AppViewToolsViewExternalLinksViewTableComponentProps) {
  const [contextMenuAnchor, setContextMenuAnchor] = useState<VirtualElement>();
  const [selectedItem, setSelectedItem] = useState<ExternalLinkResponseDto>();

  const onRowContextMenu = (e: React.MouseEvent, row: Row<ExternalLinkResponseDto>) => {
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
        <TableComponent
          columns={columns}
          data={data}
          isLoading={isLoading}
          getRowCanExpand={() => true}
          renderSubComponent={AppViewToolsViewExternalLinksViewTableComponentSubRowComponent}
          onRowContextMenu={onRowContextMenu}
        />
      </div>
      <AppViewToolsViewExternalLinksViewTableComponentContextMenuComponent
        anchorElement={contextMenuAnchor}
        setAnchorElement={setContextMenuAnchor}
        externalLink={selectedItem}
      />
    </>
  );
}
