import { Link, ToOptions } from '@tanstack/react-router';
import { ColumnDef, RowModel, flexRender } from '@tanstack/react-table';
import classNames from 'classnames';
import { ClipLoader } from 'react-spinners';

type RowLinkTableComponentBodyComponentProps<T> = {
  getRowModel: () => RowModel<T>;
  columns: ColumnDef<T>[];
  isLoading: boolean;
  data: T[];
  className?: string;
  getRowClassName?: (row: T) => string;
  cellClassName: string | undefined;
  getRowLink: (row: T) => ToOptions;
};

export default function RowLinkTableComponentBodyComponent<T>({
  getRowModel,
  columns,
  isLoading,
  data,
  className,
  getRowClassName,
  cellClassName,
  getRowLink,
}: RowLinkTableComponentBodyComponentProps<T>) {
  return (
    <div className={className}>
      {isLoading || data.length === 0 ? (
        <div>
          <div>
            <div className="flex w-full items-center justify-center">
              <ClipLoader color="#31385A" loading={isLoading} className="" size={25} speedMultiplier={1} />
              {!isLoading && 'Aucune donnée disponible.'}
            </div>
          </div>
        </div>
      ) : (
        getRowModel().rows.map((row) => (
          <div
            key={row.id}
            className={classNames('relative grid', getRowClassName ? getRowClassName(row.original) : undefined)}
            style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
          >
            {row.getVisibleCells().map((cell) => (
              <div key={cell.id} className={cellClassName}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            ))}
            {
              // We use link there to make the whole row clickable & to be able to use another link in the cell
            }
            <Link {...getRowLink(row.original)} className="absolute inset-0"></Link>
          </div>
        ))
      )}
    </div>
  );
}
