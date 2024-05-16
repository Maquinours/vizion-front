import { ColumnDef, HeaderGroup, flexRender } from '@tanstack/react-table';
import classNames from 'classnames';

type RowLinkTableComponentHeaderComponentProps<T> = Readonly<{
  getHeaderGroups: () => HeaderGroup<T>[];
  columns: Array<ColumnDef<T>>;
  className: string | undefined;
  rowClassName: string | undefined;
  cellClassName: string | undefined;
}>;

export default function RowLinkTableComponentHeaderComponent<T>({
  getHeaderGroups,
  columns,
  className,
  rowClassName,
  cellClassName,
}: RowLinkTableComponentHeaderComponentProps<T>) {
  return (
    <div className={className}>
      {getHeaderGroups().map((headerGroup) => (
        <div key={headerGroup.id} className={classNames('grid', rowClassName)} style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
          {headerGroup.headers.map((header) => (
            // Apply the header cell props
            <div key={header.id} className={cellClassName}>
              {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
