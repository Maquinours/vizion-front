import { LinkOptions } from '@tanstack/react-router';
import { ColumnDef, getCoreRowModel, getExpandedRowModel, useReactTable } from '@tanstack/react-table';
import TableComponentBodyComponent from './components/Body/Body';
import TableComponentHeaderComponent from './components/Header/Header';

type RowLinkTableComponentProps<T> = Readonly<{
  columns: ColumnDef<T>[];
  data?: T[];
  isLoading?: boolean;
  getRowLink: (row: T) => LinkOptions;
  tableClassName?: string;
  headerClassName?: string;
  headerRowClassName?: string;
  headerCellClassName?: string;
  bodyClassName?: string;
  getBodyRowClassName?: (row: T) => string;
  bodyCellClassName?: string;
}>;
export default function RowLinkTableComponent<T>({
  columns,
  data = [],
  isLoading = false,
  getRowLink,
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

  return (
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
      />
    </div>
  );
}
