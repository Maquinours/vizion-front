import { LinkOptions } from '@tanstack/react-router';
import { ColumnDef, Row, getCoreRowModel, getExpandedRowModel, useReactTable } from '@tanstack/react-table';
import TableComponentBodyComponent from './components/Body/Body';
import TableComponentHeaderComponent from './components/Header/Header';
import { useVirtualizer } from '@tanstack/react-virtual';
import React from 'react';
import classNames from 'classnames';

type RowLinkTableComponentProps<T> = Readonly<{
  columns: ColumnDef<T>[];
  data?: T[];
  isLoading?: boolean;
  getRowLink: (row: Row<T>) => LinkOptions;
  containerClassName?: string;
  tableClassName?: string;
  headerClassName?: string;
  headerRowClassName?: string;
  headerCellClassName?: string;
  bodyClassName?: string;
  getBodyRowClassName?: (row: Row<T>) => string;
  bodyCellClassName?: string;
}>;
export default function RowLinkTableComponent<T>({
  columns,
  data = [],
  isLoading = false,
  getRowLink,
  containerClassName,
  tableClassName,
  headerClassName,
  headerRowClassName,
  headerCellClassName,
  bodyClassName,
  getBodyRowClassName,
  bodyCellClassName,
}: RowLinkTableComponentProps<T>) {
  const { getHeaderGroups, getRowModel } = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const { rows } = getRowModel();

  //The virtualizer needs to know the scrollable container element
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1 ? (element) => element?.getBoundingClientRect().height : undefined,
    overscan: 5,
  });

  return (
    <div ref={tableContainerRef} className={classNames(containerClassName, 'relative overflow-auto')}>
      <div className={tableClassName}>
        <TableComponentHeaderComponent
          getHeaderGroups={getHeaderGroups}
          columns={columns}
          className={headerClassName}
          rowClassName={headerRowClassName}
          cellClassName={headerCellClassName}
        />
        <TableComponentBodyComponent
          getRowModel={getRowModel}
          columns={columns}
          isLoading={isLoading}
          data={data}
          className={bodyClassName}
          getRowClassName={getBodyRowClassName}
          cellClassName={bodyCellClassName}
          getRowLink={getRowLink}
          rowVirtualizer={rowVirtualizer}
        />
      </div>
    </div>
  );
}
