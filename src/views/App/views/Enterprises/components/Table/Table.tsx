import { Link, getRouteApi } from '@tanstack/react-router';
import { Row, createColumnHelper } from '@tanstack/react-table';
import { useCallback, useContext, useMemo, useState } from 'react';
import TableComponent from '../../../../../../components/Table/Table';
import EnterpriseResponseDto from '../../../../../../utils/types/EnterpriseResponseDto';
import ProfileResponseDto from '../../../../../../utils/types/ProfileResponseDto';
import { TabsContext } from '../../../../components/TabsContainer/utils/contexts/context';
import AppViewEnterprisesViewTableComponentContactContextMenu from './components/ContactContextMenu/ContactContextMenu';
import AppViewEnterprisesViewTableComponentContactsCellComponent from './components/ContactsCell/ContactsCell';
import styles from './Table.module.scss';

const routeApi = getRouteApi('/app/enterprises');

const columnHelper = createColumnHelper<EnterpriseResponseDto>();

type AppViewEnterprisesViewTableComponentProps = Readonly<{
  data: Array<EnterpriseResponseDto> | undefined;
  isLoading: boolean;
  linkToBusinessId?: string;
}>;
export default function AppViewEnterprisesViewTableComponent({ data, isLoading, linkToBusinessId }: AppViewEnterprisesViewTableComponentProps) {
  const navigate = routeApi.useNavigate();

  const { getCurrentTab, updateTabRoute } = useContext(TabsContext)!;

  const [contactContextMenuAnchor, setContactContextMenuAnchor] = useState<HTMLElement>();
  const [contact, setContact] = useState<ProfileResponseDto>();

  const onContactContextMenu = useCallback(
    (e: React.MouseEvent, contact: ProfileResponseDto) => {
      e.preventDefault();
      setContact(contact);
      setContactContextMenuAnchor(e.target as HTMLElement);
    },
    [setContact, setContactContextMenuAnchor],
  );

  const removeLinkToBusinessId = useCallback(() => {
    const currentTabId = getCurrentTab()?.id;
    if (currentTabId)
      updateTabRoute(currentTabId, (tab) => ({
        search: { ...(typeof tab.route.search === 'object' && tab.route.search !== null ? tab.route.search : {}), linkToBusinessId: undefined },
      }));
  }, [getCurrentTab, updateTabRoute]);

  const columns = useMemo(
    () => [
      columnHelper.display({
        header: 'Entreprise',
        cell: ({ row: { original } }) => {
          if (linkToBusinessId)
            return (
              <Link
                from={routeApi.id}
                to="$enterpriseId/relate-business-rma"
                params={{ enterpriseId: original.id }}
                search={{ defaultBusinessRmaId: linkToBusinessId }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  removeLinkToBusinessId();
                }}
              >
                {original.name}
              </Link>
            );
          else
            return (
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
            );
        },
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
    [onContactContextMenu, linkToBusinessId, removeLinkToBusinessId],
  );

  const onRowClick = (e: React.MouseEvent, row: Row<EnterpriseResponseDto>) => {
    if (linkToBusinessId) {
      removeLinkToBusinessId();
      if (e.metaKey || e.ctrlKey)
        window.open(
          `${window.location.origin}/app/enterprises/${row.original.id}/relate-business-rma?defaultBusinessRmaId=${encodeURIComponent(linkToBusinessId)}`,
          '_blank',
        );
      else navigate({ to: '$enterpriseId/relate-business-rma', params: { enterpriseId: row.original.id }, search: { defaultBusinessRmaId: linkToBusinessId } });
    } else {
      if (e.metaKey || e.ctrlKey) window.open(`${window.location.origin}/app/enterprises/${row.original.id}`, '_blank');
      else navigate({ to: '$enterpriseId', params: { enterpriseId: row.original.id } });
    }
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
