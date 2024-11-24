import { ColumnDef, Row, RowModel, flexRender } from '@tanstack/react-table';
import React from 'react';
import { ClipLoader } from 'react-spinners';
import styles from './Body.module.scss';

type TableComponentBodyComponentProps<T> = {
  getRowModel: () => RowModel<T>;
  columns: ColumnDef<T>[];
  isLoading: boolean;
  data: T[];
  onRowClick?: (e: React.MouseEvent, row: Row<T>) => void;
  onRowContextMenu?: (e: React.MouseEvent, row: Row<T>) => void;
  renderSubComponent: ((props: { row: Row<T> }) => React.ReactElement) | undefined;
  getRowClassName?: (row: T) => string | undefined;
  getRowId?: (row: T) => string;
};

export default function TableComponentBodyComponent<T>({
  getRowModel,
  columns,
  isLoading,
  data,
  onRowClick = () => {},
  onRowContextMenu = () => {},
  renderSubComponent,
  getRowClassName,
  getRowId,
}: TableComponentBodyComponentProps<T>) {
  return (
    <tbody>
      {isLoading || data.length === 0 ? (
        <tr>
          <td colSpan={columns.length}>
            <div className={styles.nodata_row}>
              <ClipLoader color="#31385A" loading={isLoading} className="" size={25} speedMultiplier={1} />
              {!isLoading && 'Aucune donnée disponible.'}
            </div>
          </td>
        </tr>
      ) : (
        getRowModel().rows.map((row) => (
          <React.Fragment key={row.id}>
            <tr
              className={getRowClassName ? getRowClassName(row.original) : undefined}
              id={getRowId ? getRowId(row.original) : undefined}
              onContextMenu={(e) => onRowContextMenu(e, row)}
              onClick={(e) => onRowClick(e, row)}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
            {renderSubComponent !== undefined && row.getIsExpanded() && renderSubComponent({ row })}
          </React.Fragment>
        ))
      )}
    </tbody>
  );
}
