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
  rowSelection?: RowSelectionState;
  setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  rowId?: keyof T;
  getRowCanExpand?(row: Row<T>): boolean;
  getSubRows?(row: T): Array<T>;
  renderSubComponent?: (props: { row: Row<T> }) => React.ReactElement;
}>;
export default function TableComponent<T>({
  columns,
  data = [],
  isLoading = false,
  onRowClick,
  onRowContextMenu,
  rowSelection,
  setRowSelection,
  rowId,
  getRowCanExpand,
  getSubRows,
  renderSubComponent,
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
  });

  return (
    <table>
      <TableComponentHeaderComponent getHeaderGroups={getHeaderGroups} />
      <TableComponentBodyComponent
        getRowModel={getRowModel}
        columns={columns}
        isLoading={isLoading}
        data={data}
        onRowClick={onRowClick}
        onRowContextMenu={onRowContextMenu}
        renderSubComponent={renderSubComponent}
      />
    </table>
  );
}
