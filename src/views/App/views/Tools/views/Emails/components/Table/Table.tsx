import { Link, getRouteApi } from '@tanstack/react-router';
import { Row, createColumnHelper } from '@tanstack/react-table';
import TableComponent from '../../../../../../../../components/Table/Table';
import { PUBLIC_BASE_URL } from '../../../../../../../../utils/constants/api';
import { formatDateAndHourWithSlash } from '../../../../../../../../utils/functions/dates';
import MailResponseDto from '../../../../../../../../utils/types/MailResponseDto';
import styles from './Table.module.scss';

const routeApi = getRouteApi('/app/tools/emails');

const columnHelper = createColumnHelper<MailResponseDto>();
const columns = [
  columnHelper.display({
    header: "Date & heure de l'envoi",
    cell: ({ row: { original } }) => formatDateAndHourWithSlash(original.sendDate),
  }),
  columnHelper.display({
    header: "Adresse mail de l'expéditeur",
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
        from={routeApi.id}
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
];

type AppViewToolsViewEmailsViewTableComponentProps = Readonly<{ isLoading: boolean; data: Array<MailResponseDto> | undefined }>;
export default function AppViewToolsViewEmailsViewTableComponent({ isLoading, data }: AppViewToolsViewEmailsViewTableComponentProps) {
  const navigate = routeApi.useNavigate();

  const onRowClick = (e: React.MouseEvent, row: Row<MailResponseDto>) => {
    if (e.metaKey || e.ctrlKey) window.open(`${window.location.origin}/app/tools/emails/${row.original.id}`, '_blank');
    else navigate({ to: '$emailId', params: { emailId: row.original.id }, search: true, replace: true, resetScroll: false });
  };

  return (
    <div className={styles.table_container}>
      <TableComponent columns={columns} data={data} isLoading={isLoading} onRowClick={onRowClick} />
    </div>
  );
}
