import { Row, createColumnHelper } from '@tanstack/react-table';
import TableComponent from '../../../Table/Table';
import FileDataTreeResponseDto from '../../../../utils/types/FileDataTreeResponseDto';
import { RiArrowDropDownLine, RiArrowDropRightLine } from 'react-icons/ri';
import { FaFolder } from 'react-icons/fa';
import { AiFillFile } from 'react-icons/ai';
import { PUBLIC_BASE_URL } from '../../../../utils/constants/api';
import { bytesToString } from '../../../../utils/functions/bytesToString';
import styles from './Table.module.scss';
import React, { useState } from 'react';
import { VirtualElement } from '@popperjs/core';
import GedComponentTableComponentContextMenuComponent from './component/ContextMenu/ContextMenu';

const columnHelper = createColumnHelper<FileDataTreeResponseDto>();
const gedColumns = [
  columnHelper.display({
    id: 'expand',
    cell: ({ row }) =>
      row.getCanExpand() ? (
        <button
          {...{
            onClick: row.getToggleExpandedHandler(),
            style: { cursor: 'pointer', paddingLeft: `${row.depth * 1}rem` },
          }}
        >
          {row.getIsExpanded() ? <RiArrowDropDownLine size="18px" /> : <RiArrowDropRightLine size="18px" />}
        </button>
      ) : null,
  }),
  columnHelper.display({
    header: 'name',
    cell: ({ row }) => (
      <div className={styles.directory}>
        <div className={styles.directory_file_name}>
          {row.original.dir ? (
            <>
              <FaFolder color="#16204E" />
              <p>{row.original.name}</p>
            </>
          ) : (
            <>
              <AiFillFile color="#16204E" />
              <a
                style={{
                  color: 'var(--primary-color)',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  paddingTop: '5px',
                }}
                href={`${PUBLIC_BASE_URL}ged/v1/s3/download?filename=${row.original.key.replace('&', '%26')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {row.original.name}
              </a>
            </>
          )}
        </div>
      </div>
    ),
  }),
  columnHelper.display({ header: 'Taille', cell: ({ row: { original } }) => !original.dir && <p>{bytesToString(original.size)}</p> }),
];

type GedComponentTableComponentProps = Readonly<{
  isLoading: boolean;
  data: FileDataTreeResponseDto[] | undefined;
}>;
export default function GedComponentTableComponent({ isLoading, data }: GedComponentTableComponentProps) {
  const [contextMenuAnchor, setContextMenuAnchor] = useState<VirtualElement>();
  const [selectedItem, setSelectedItem] = useState<FileDataTreeResponseDto>();

  const onRowContextMenu = (e: React.MouseEvent, row: Row<FileDataTreeResponseDto>) => {
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
      <div className={styles.ged_table}>
        <div className={styles.table_container}>
          <TableComponent
            columns={gedColumns}
            data={data ?? []}
            isLoading={isLoading}
            onRowContextMenu={onRowContextMenu}
            rowId={'key'}
            getSubRows={(row) => row.subRows ?? []}
          />
        </div>
      </div>
      <GedComponentTableComponentContextMenuComponent anchorElement={contextMenuAnchor} setAnchorElement={setContextMenuAnchor} selectedItem={selectedItem} />
    </>
  );
}
