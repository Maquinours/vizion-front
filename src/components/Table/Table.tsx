import { useReactTable, getCoreRowModel, ColumnDef, Row } from '@tanstack/react-table';
import TableComponentHeaderComponent from './components/Header/Header';
import TableComponentBodyComponent from './components/Body/Body';
import React from 'react';

interface TableComponentProps<T> {
  columns: ColumnDef<T>[];
  data?: T[];
  isLoading?: boolean;
  onRowClick?: (e: React.MouseEvent, row: Row<T>) => void;
  onRowContextMenu?: (e: React.MouseEvent, row: Row<T>) => void;
}
export default function TableComponent<T>({ columns, data = [], isLoading = false, onRowClick, onRowContextMenu }: TableComponentProps<T>) {
  const { getHeaderGroups, getRowModel } = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
      />
    </table>
  );
}
