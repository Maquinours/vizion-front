import ReactModal from 'react-modal';
import styles from './EmailHistoryModal.module.scss';
import { getRouteApi, Link, Outlet } from '@tanstack/react-router';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import _ from 'lodash';
import TableComponent from '../../../../../../../../components/Table/Table';
import { createColumnHelper, Row } from '@tanstack/react-table';
import MailResponseDto from '../../../../../../../../utils/types/MailResponseDto';
import { formatDateAndHourWithSlash } from '../../../../../../../../utils/functions/dates';
import { PUBLIC_BASE_URL } from '../../../../../../../../utils/constants/api';
import PaginationComponent from '../../../../../../../../components/Pagination/Pagination';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/dashboard/email-history');
const routePath = '/app/businesses-rma/business/$businessId/dashboard/email-history';

const columnHelper = createColumnHelper<MailResponseDto>();
const columns = [
  columnHelper.display({
    header: "Date & heure de l'envoi",
    cell: ({ row: { original } }) => formatDateAndHourWithSlash(original.sendDate),
  }),
  columnHelper.display({
    header: 'Expéditeur',
    cell: ({ row: { original } }) => original.sender,
  }),
  columnHelper.display({
    header: 'Destinataire(s)',
    cell: ({ row: { original } }) => (
      <ul>
        {original.receiver.split(';').map((item, key) => (
          <li key={key}>{item}</li>
        ))}
      </ul>
    ),
  }),
  columnHelper.display({
    header: 'Objet',
    cell: ({ row: { original } }) => (
      <Link
        from={routePath}
        to="$emailId"
        params={{ emailId: original.id }}
        search
        replace
        resetScroll={false}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {original.subject}
      </Link>
    ),
  }),
  columnHelper.display({
    header: 'Pièces jointes',
    cell: ({ row: { original } }) =>
      original.pjList.length > 0 && (
        <div className="flex flex-col gap-y-1">
          {original.pjList.map((item) => (
            <a
              key={item.id}
              href={`${PUBLIC_BASE_URL}mail/v1/download-file/${item.name}?ref=${original.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {item.name}
            </a>
          ))}
        </div>
      ),
  }),
  columnHelper.display({
    id: 'scrollbar_compensator',
  }),
];

export default function AppViewBusinessViewDashboardViewEmailHistoryModalView() {
  const navigate = routeApi.useNavigate();

  const { businessId } = routeApi.useParams();

  const { page } = routeApi.useSearch();

  const { size } = routeApi.useLoaderDeps();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const emails = _.uniq(
    [business.billingEmail, business.deliverEmail, business.profileEmail]
      .filter((address): address is string => !!address)
      .map((address) => address.toLowerCase()),
  );

  const { data, isLoading } = useQuery(queries.emails.page._ctx.byEmailAddresses(emails, { page, size }));

  const onClose = () => {
    navigate({ to: '..', search: (old) => ({ ...old, page: undefined }), replace: true, resetScroll: false });
  };

  const onRowClick = (e: React.MouseEvent, row: Row<MailResponseDto>) => {
    if (e.metaKey || e.ctrlKey)
      window.open(`${window.location.origin}/app/businesses-rma_/business/$businessId/dashboard/email-history/${row.original.id}`, '_blank');
    else navigate({ to: '$emailId', params: { emailId: row.original.id }, search: true, replace: true, resetScroll: false });
  };

  return (
    <>
      <ReactModal isOpen className={styles.modal} onRequestClose={onClose} overlayClassName="Overlay">
        <div className={styles.modal_container}>
          <div className={styles.modal_title}>
            <h6>Historique des mails</h6>
          </div>
          <div className={styles.modal_content}>
            <div className="mb-2 flex flex-row gap-x-1 self-end text-[var(--primary-color)]">
              <span className="font-semibold">Adresses recherchées :</span>
              <div className="flex flex-row gap-x-0.5">
                {emails.map((email) => (
                  <span key={email} className="border border-[var(--primary-color)] px-0.5">
                    {email}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.table_container}>
              <TableComponent columns={columns} data={data?.content} isLoading={isLoading} onRowClick={onRowClick} />
            </div>
            <PaginationComponent
              page={page}
              totalPages={data?.totalPages}
              pageLink={(page) => ({ search: (old) => ({ ...old, page }), preload: 'intent', replace: true, resetScroll: false })}
            />

            <div className={styles.modal_buttons}>
              <button className="btn btn-secondary" onClick={onClose}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      </ReactModal>
      <Outlet />
    </>
  );
}
