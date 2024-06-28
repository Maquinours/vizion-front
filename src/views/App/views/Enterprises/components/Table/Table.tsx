import { Row, createColumnHelper } from '@tanstack/react-table';
import EnterpriseResponseDto from '../../../../../../utils/types/EnterpriseResponseDto';
import AppViewEnterprisesViewTableComponentContactsCellComponent from './components/ContactsCell/ContactsCell';
import TableComponent from '../../../../../../components/Table/Table';
import styles from './Table.module.scss';
import { Link, getRouteApi, useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';

const Route = getRouteApi('/app/enterprises');

const columnHelper = createColumnHelper<EnterpriseResponseDto>();
const columns = [
  columnHelper.display({
    header: 'Entreprise',
    cell: ({ row: { original } }) => (
      <Link
        from={Route.id}
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
    cell: AppViewEnterprisesViewTableComponentContactsCellComponent,
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
];

type AppViewEnterprisesViewTableComponentProps = Readonly<{
  data: Array<EnterpriseResponseDto> | undefined;
  isLoading: boolean;
}>;
export default function AppViewEnterprisesViewTableComponent({ data, isLoading }: AppViewEnterprisesViewTableComponentProps) {
  const navigate = useNavigate({ from: Route.id });

  const onRowClick = useCallback(
    (e: React.MouseEvent, row: Row<EnterpriseResponseDto>) => {
      if (e.metaKey || e.ctrlKey) window.open(`${window.location.origin}/app/enterprises/${row.original.id}`, '_blank');
      else navigate({ to: '$enterpriseId', params: { enterpriseId: row.original.id } });
    },
    [navigate],
  );

  return (
    <div className={styles.container}>
      <TableComponent<EnterpriseResponseDto> columns={columns} data={data} isLoading={isLoading} rowId="id" onRowClick={onRowClick} />
    </div>
  );
}
