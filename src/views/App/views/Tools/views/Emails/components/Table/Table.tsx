import { createColumnHelper } from '@tanstack/react-table';
import MailResponseDto from '../../../../../../../../utils/types/MailResponseDto';
import { formatDateAndHourWithSlash } from '../../../../../../../../utils/functions/dates';
import { PUBLIC_BASE_URL } from '../../../../../../../../utils/constants/api';
import TableComponent from '../../../../../../../../components/Table/Table';
import styles from './Table.module.scss';

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
    cell: ({ row: { original } }) => original.subject,
  }),
  columnHelper.display({
    header: 'Pièces jointes',
    cell: ({ row: { original } }) =>
      original.pjList.length > 0 && (
        <ul>
          {original.pjList.map((item) => (
            <li key={item.id} style={{ marginBottom: '5px', cursor: 'pointer' }}>
              <a href={`${PUBLIC_BASE_URL}mail/v1/download-file/${item.name}?ref=${original.id}`} target="_blank" rel="noopener noreferrer">
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      ),
  }),
];

type AppViewToolsViewEmailsViewTableComponentProps = Readonly<{ isLoading: boolean; data: Array<MailResponseDto> | undefined }>;
export default function AppViewToolsViewEmailsViewTableComponent({ isLoading, data }: AppViewToolsViewEmailsViewTableComponentProps) {
  return (
    <div className={styles.table_container}>
      <TableComponent columns={columns} data={data} isLoading={isLoading} />
    </div>
  );
}
