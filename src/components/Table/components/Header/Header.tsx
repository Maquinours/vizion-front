import { HeaderGroup, flexRender } from '@tanstack/react-table';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
// import classNames from 'classnames';

type TableComponentHeaderComponentProps<T> = Readonly<{
  getHeaderGroups: () => HeaderGroup<T>[];
  className?: string;
}>;

export default function TableComponentHeaderComponent<T>({ getHeaderGroups, className }: TableComponentHeaderComponentProps<T>) {
  return (
    <thead className={className}>
      {getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            // Apply the header cell props
            <th key={header.id}>
              {header.isPlaceholder ? null : (
                <div className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''} onClick={header.column.getToggleSortingHandler()}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: <IoIosArrowUp className="ml-1" />,
                    desc: <IoIosArrowDown className="ml-1" />,
                  }[header.column.getIsSorted() as string] ?? null}
                </div>
              )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
}
