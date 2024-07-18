import { useReactTable, getCoreRowModel, ColumnDef, Row, getExpandedRowModel, RowSelectionState } from '@tanstack/react-table';
import TableComponentHeaderComponent from './components/Header/Header';
import TableComponentBodyComponent from './components/Body/Body';
import React from 'react';

type TableComponentProps<T> = Readonly<{
  columns: ColumnDef<T>[];
  data?: T[];
  isLoading?: boolean;
  onRowClick?: (e: React.MouseEvent, row: Row<T>) => void;
  onRowContextMenu?: (e: React.MouseEvent, row: Row<T>) => void;
  onRowMouseOver?: (e: React.MouseEvent, row: Row<T>) => void;
  rowSelection?: RowSelectionState;
  setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  rowId?: keyof T;
  getRowCanExpand?(row: Row<T>): boolean;
  getSubRows?(row: T): Array<T>;
  renderSubComponent?: (props: { row: Row<T> }) => React.ReactElement;
  getRowClassName?: (row: T) => string | undefined;
  className?: string;
  headerClassName?: string;
  enableMultiRowSelection?: boolean;
  getRowId?: (row: T) => string;
}>;
export default function TableComponent<T>({
  columns,
  data = [],
  isLoading = false,
  onRowClick,
  onRowContextMenu,
  onRowMouseOver,
  rowSelection,
  setRowSelection,
  rowId,
  getRowCanExpand,
  getSubRows,
  renderSubComponent,
  getRowClassName,
  className,
  headerClassName,
  enableMultiRowSelection,
  getRowId,
}: TableComponentProps<T>) {
  const { getHeaderGroups, getRowModel } = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand,
    getSubRows,
    getRowId: rowId ? (row) => row[rowId] as string : undefined,
    enableMultiRowSelection: enableMultiRowSelection,
  });

  return (
    <table className={className}>
      <TableComponentHeaderComponent getHeaderGroups={getHeaderGroups} className={headerClassName} />
      <TableComponentBodyComponent
        getRowModel={getRowModel}
        columns={columns}
        isLoading={isLoading}
        data={data}
        onRowClick={onRowClick}
        onRowContextMenu={onRowContextMenu}
        onRowMouseOver={onRowMouseOver}
        renderSubComponent={renderSubComponent}
        getRowClassName={getRowClassName}
        getRowId={getRowId}
      />
    </table>
  );
}
