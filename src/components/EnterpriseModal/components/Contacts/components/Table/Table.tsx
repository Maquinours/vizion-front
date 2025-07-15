import { VirtualElement } from '@popperjs/core';
import { Row, createColumnHelper } from '@tanstack/react-table';
import { useState } from 'react';
import ProfileResponseDto from '../../../../../../utils/types/ProfileResponseDto';
import TableComponent from '../../../../../Table/Table';
import styles from './Table.module.scss';
import EnterpriseModalComponentContactsComponentTableComponentContextMenuComponent from './components/ContextMenu/ContextMenu';

const columnHelper = createColumnHelper<ProfileResponseDto>();
const columns = [
  columnHelper.display({
    header: 'Nom',
    cell: ({ row: { original } }) => (
      <>
        <p>
          {original.lastName} {original.firstName}
        </p>
        <p>{original.job}</p>
      </>
    ),
  }),
  columnHelper.display({ header: 'Téléphone', cell: ({ row: { original } }) => original.phoneNumber ?? original.standardPhoneNumber }),
  columnHelper.display({ header: 'Mail', cell: ({ row: { original } }) => original.email }),
];

type EnterpriseModalComponentContactsComponentTableComponentProps = Readonly<{
  data: Array<ProfileResponseDto> | undefined;
}>;
export default function EnterpriseModalComponentContactsComponentTableComponent({ data }: EnterpriseModalComponentContactsComponentTableComponentProps) {
  const [contextMenuAnchor, setContextMenuAnchor] = useState<VirtualElement>();
  const [contact, setContact] = useState<ProfileResponseDto>();

  const onRowContextMenu = (e: React.MouseEvent, row: Row<ProfileResponseDto>) => {
    e.preventDefault();
    setContact(row.original);
    setContextMenuAnchor({
      getBoundingClientRect: () => ({
        width: 0,
        height: 0,
        x: e.clientX,
        y: e.clientY,
        top: e.clientY,
        right: e.clientX,
        bottom: e.clientY,
        left: e.clientX,
        toJSON: () => {},
      }),
    });
  };

  return (
    <>
      <div className={styles.container}>
        <TableComponent<ProfileResponseDto> data={data} columns={columns} isLoading={false} rowId="email" onRowContextMenu={onRowContextMenu} />
      </div>
      <EnterpriseModalComponentContactsComponentTableComponentContextMenuComponent
        anchorElement={contextMenuAnchor}
        setAnchorElement={setContextMenuAnchor}
        profile={contact}
      />
    </>
  );
}
