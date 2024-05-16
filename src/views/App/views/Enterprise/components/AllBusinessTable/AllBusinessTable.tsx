import { createColumnHelper } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import styles from './AllBusinessTable.module.scss';
import AllBusinessState from '../../../../../../utils/enums/AllBusinessState';
import CurrencyFormat from '../../../../../../components/CurrencyFormat/CurrencyFormat';
import CategoryBusiness from '../../../../../../utils/enums/CategoryBusiness';
import { formatDateAndHourWithSlash } from '../../../../../../utils/functions/dates';
import { allBusinesses } from '../../../../../../utils/constants/queryKeys/allBusiness';
import CardComponent from '../../../../../../components/Card/Card';
import PaginationComponent from '../../../../../../components/Pagination/Pagination';
import TableComponent from '../../../../../../components/Table/Table';
import AllBusinessResponseDto from '../../../../../../utils/types/AllBusinessResponseDto';
import { Link } from '@tanstack/react-router';

const size = 15;

const states = [
  {
    label: 'Créée',
    value: AllBusinessState.CREATED,
  },
  {
    label: 'Devis',
    value: AllBusinessState.DEVIS,
  },
  {
    label: 'ARC',
    value: AllBusinessState.ARC,
  },
  {
    label: 'BP',
    value: AllBusinessState.BP,
  },
  {
    label: 'BL',
    value: AllBusinessState.BL,
  },
  {
    label: 'Facture',
    value: AllBusinessState.FACTURE,
  },
  {
    label: 'Bloqué',
    value: AllBusinessState.BLOQUE,
  },
  {
    label: 'Reception',
    value: AllBusinessState.RECEPTION,
  },
  {
    label: 'Prise en charge',
    value: AllBusinessState.PRISE_EN_CHARGE,
  },
  {
    label: 'Analyse',
    value: AllBusinessState.ANALYSE_REPARATION_EXPEDITION,
  },
  {
    label: 'Archive',
    value: AllBusinessState.ARCHIVE,
  },
];

const Route = getRouteApi('/app/enterprises/$enterpriseId');

const columnHelper = createColumnHelper<AllBusinessResponseDto>();
const columns = [
  columnHelper.display({
    header: "N° de l'affaire",
    cell: ({ row: { original } }) => {
      const children = original.number;
      if (original.category === CategoryBusiness.AFFAIRE)
        return (
          <Link to="/app/businesses-rma/business/$businessId" params={{ businessId: original.businessId }}>
            {children}
          </Link>
        );
      else return children; // TODO: add link to RMA
    },
  }),
  columnHelper.display({
    header: "Nom de l'affaire",
    cell: ({ row: { original } }) => original.title,
  }),
  columnHelper.display({
    header: 'Client',
    cell: ({ row: { original } }) => original.profileName,
  }),
  columnHelper.display({
    header: 'Dernière modification',
    cell: ({ row: { original } }) => formatDateAndHourWithSlash(original.modifiedDate),
  }),
  columnHelper.display({
    header: 'Montant HT',
    cell: ({ row: { original } }) => (original.category === CategoryBusiness.AFFAIRE ? <CurrencyFormat value={original.totalHt} /> : 'SAV'),
  }),
  columnHelper.display({
    header: 'Représentant',
    cell: ({ row: { original } }) => <p>{original.representativeName}</p>,
  }),
  columnHelper.display({
    header: 'État',
    cell: ({ row: { original } }) =>
      `${states.find((state) => state.value === original.state)?.label} ${original.state === AllBusinessState.FACTURE ? original.businessBillNumber : ''}`,
  }),
];

export default function AppViewEnterpriseViewAllBusinessTableComponent() {
  const { enterpriseId } = Route.useParams();
  const { allBusinessPage: page } = Route.useSearch();

  const { data, isLoading } = useQuery(allBusinesses.page._ctx.byEnterpriseId({ enterpriseId, page, size }));

  //   const onRowClick = (e: React.MouseEvent, row: Row<AllBusinessResponseDto>) => {
  //     if (e.metaKey || e.ctrlKey) window.open(`/app/business/${row.original.businessId}`); // TODO: reimplement this
  //     else navigate({ to: '/app/business/$businessId', params: { businessId: row.original.businessId } });
  //   };

  return (
    <div className={styles.container}>
      <CardComponent title="Affaires en cours">
        <div className={styles.card_container}>
          <div className={styles.table_container}>
            <TableComponent<AllBusinessResponseDto> columns={columns} isLoading={isLoading} data={data?.content ?? []} rowId="id" />
          </div>
          <div className={styles.pagination}>
            <PaginationComponent
              page={page}
              totalPages={data?.totalPages}
              pageLink={(page) => ({ from: Route.id, search: (old) => ({ ...old, allBusinessPage: page }), params: (old) => old })}
            />
          </div>
        </div>
      </CardComponent>
    </div>
  );
}
