import { HeaderGroup, flexRender } from '@tanstack/react-table';

type TableComponentHeaderComponentProps<T> = Readonly<{
  getHeaderGroups: () => HeaderGroup<T>[];
}>;

export default function TableComponentHeaderComponent<T>({ getHeaderGroups }: TableComponentHeaderComponentProps<T>) {
  return (
    <thead>
      {getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            // Apply the header cell props
            <th key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</th>
          ))}
        </tr>
      ))}
    </thead>
  );
}
