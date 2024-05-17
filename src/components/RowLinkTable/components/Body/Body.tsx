import { Link, ToOptions } from '@tanstack/react-router';
import { ColumnDef, Row, RowModel, flexRender } from '@tanstack/react-table';
import { Virtualizer } from '@tanstack/react-virtual';
import classNames from 'classnames';
import { ClipLoader } from 'react-spinners';

type RowLinkTableComponentBodyComponentProps<T> = {
  getRowModel: () => RowModel<T>;
  columns: ColumnDef<T>[];
  isLoading: boolean;
  data: T[];
  className?: string;
  getRowClassName?: (row: Row<T>) => string;
  cellClassName: string | undefined;
  getRowLink: (row: Row<T>) => ToOptions;
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
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
  rowVirtualizer,
}: RowLinkTableComponentBodyComponentProps<T>) {
  const rows = getRowModel().rows;

  return (
    <div className={classNames(className, 'relative grid')} style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
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
        rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index] as Row<T>;
          return (
            <div
              key={row.id}
              data-index={virtualRow.index} //needed for dynamic row height measurement
              ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
              className={classNames('absolute grid w-full', getRowClassName ? getRowClassName(row) : undefined)}
              style={{
                gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
                transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <div key={cell.id} className={cellClassName}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
              {
                // We use link there to make the whole row clickable & to be able to use another link in the cell
              }
              <Link {...getRowLink(row)} className="absolute inset-0"></Link>
            </div>
          );
        })
      )}
    </div>
  );
}
