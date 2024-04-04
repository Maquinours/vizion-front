import { Row, createColumnHelper } from '@tanstack/react-table';
import TableComponent from '../../../../../../../../components/Table/Table';
import ProgressiveInfoResponseDto from '../../../../../../../../utils/types/ProgressiveInfoResponseDto';
import { formatDate } from '../../../../../../../../utils/functions/dates';
import { VirtualElement } from '@popperjs/core';
import React, { useState } from 'react';
import AppViewDashboardViewProgressiveInfosComponentTableComponentContextMenuComponent from './components/ContextMenu/ContextMenu';
import styles from './Table.module.scss';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

const columnHelper = createColumnHelper<ProgressiveInfoResponseDto>();

const columns = [
  columnHelper.display({
    id: 'content',
    header: '',
    cell: ({ row: { original } }) => (
      <div className={styles.more_content}>
        <div className={styles.more_content_data}>
          <div className={styles.more_content_data_text}>{parse(DOMPurify.sanitize(original.content ?? ''))}</div>
        </div>
        <div className={styles.date}>
          <p> {original.modifiedDate ? formatDate(original.modifiedDate) : 'Inconnu'}</p>
        </div>
      </div>
    ),
  }),
];

type AppViewDashboardViewProgressiveInfosComponentTableComponentProps = Readonly<{
  data: Array<ProgressiveInfoResponseDto> | undefined;
  isLoading: boolean;
}>;

export default function AppViewDashboardViewProgressiveInfosComponentTableComponent({
  data,
  isLoading,
}: AppViewDashboardViewProgressiveInfosComponentTableComponentProps) {
  const [contextMenuAnchor, setContextMenuAnchor] = useState<VirtualElement>();
  const [progressiveInfo, setProgressiveInfo] = useState<ProgressiveInfoResponseDto>();

  const onRowContextMenu = (e: React.MouseEvent, row: Row<ProgressiveInfoResponseDto>) => {
    e.preventDefault();
    setProgressiveInfo(row.original);
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
        <TableComponent columns={columns} data={data} isLoading={isLoading} onRowContextMenu={onRowContextMenu} rowId={'id'} />
      </div>
      <AppViewDashboardViewProgressiveInfosComponentTableComponentContextMenuComponent
        anchor={contextMenuAnchor}
        setAnchor={setContextMenuAnchor}
        progressiveInfo={progressiveInfo}
      />
    </>
  );
}
