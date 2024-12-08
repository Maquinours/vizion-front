import { VirtualElement } from '@popperjs/core';
import { Link, getRouteApi } from '@tanstack/react-router';
import { Row, createColumnHelper } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import TableComponent from '../../../../../../components/Table/Table';
import EnterpriseResponseDto from '../../../../../../utils/types/EnterpriseResponseDto';
import ProfileResponseDto from '../../../../../../utils/types/ProfileResponseDto';
import AppViewEnterprisesViewTableComponentContactContextMenu from './components/ContactContextMenu/ContactContextMenu';
import AppViewEnterprisesViewTableComponentContactsCellComponent from './components/ContactsCell/ContactsCell';
import styles from './Table.module.scss';

const routeApi = getRouteApi('/app/enterprises');

const columnHelper = createColumnHelper<EnterpriseResponseDto>();

type AppViewEnterprisesViewTableComponentProps = Readonly<{
  data: Array<EnterpriseResponseDto> | undefined;
  isLoading: boolean;
}>;
export default function AppViewEnterprisesViewTableComponent({ data, isLoading }: AppViewEnterprisesViewTableComponentProps) {
  const navigate = routeApi.useNavigate();

  const [contactContextMenuAnchor, setContactContextMenuAnchor] = useState<VirtualElement>();
  const [contact, setContact] = useState<ProfileResponseDto>();

  const onContactContextMenu = (e: React.MouseEvent, contact: ProfileResponseDto) => {
    e.preventDefault();
    setContact(contact);
    setContactContextMenuAnchor({
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

  const columns = useMemo(
    () => [
      columnHelper.display({
        header: 'Entreprise',
        cell: ({ row: { original } }) => (
          <Link
            from={routeApi.id}
            to="$enterpriseId"
            params={{ enterpriseId: original.id }}
            onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
          >
            {original.name}
          </Link>
        ),
      }),
      columnHelper.display({
        header: 'Contacts',
        cell: ({ row }) => <AppViewEnterprisesViewTableComponentContactsCellComponent row={row} onContactContextMenu={onContactContextMenu} />,
      }),
      columnHelper.display({
        header: 'Adresse',
        cell: ({ row: { original } }) => (
          <>
            <p>{original.addressLineOne}</p>
            <p>
              {original.zipCode} {original.city}
            </p>
          </>
        ),
      }),
      columnHelper.display({
        header: 'Enseigne',
        cell: ({ row: { original } }) => <p>{original.sign}</p>,
      }),
      columnHelper.display({
        header: 'Catégorie',
        cell: ({ row: { original } }) => <p>{original.category}</p>,
      }),
      columnHelper.display({
        header: 'Représentant',
        cell: ({ row: { original } }) => <p>{original.infoSup?.representative?.name ?? ''}</p>,
      }),
      columnHelper.display({
        header: 'Relations',
        cell: ({ row: { original } }) =>
          original?.infoSup?.enterpriseRelationShips &&
          original.infoSup.enterpriseRelationShips.length > 0 && (
            <ul>
              {original.infoSup.enterpriseRelationShips.map((itm) => (
                <li key={itm.id}>{itm.fullName}</li>
              ))}
            </ul>
          ),
      }),
      columnHelper.display({
        id: 'scrollbar_compensator',
      }),
    ],
    [onContactContextMenu],
  );

  const onRowClick = (e: React.MouseEvent, row: Row<EnterpriseResponseDto>) => {
    if (e.metaKey || e.ctrlKey) window.open(`${window.location.origin}/app/enterprises/${row.original.id}`, '_blank');
    else navigate({ to: '$enterpriseId', params: { enterpriseId: row.original.id } });
  };

  return (
    <>
      <div className={styles.container}>
        <TableComponent<EnterpriseResponseDto> columns={columns} data={data} isLoading={isLoading} rowId="id" onRowClick={onRowClick} />
      </div>
      <AppViewEnterprisesViewTableComponentContactContextMenu
        contact={contact}
        anchorElement={contactContextMenuAnchor}
        setAnchorElement={setContactContextMenuAnchor}
      />
    </>
  );
}
