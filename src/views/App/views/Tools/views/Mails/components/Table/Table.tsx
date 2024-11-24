import { createColumnHelper } from '@tanstack/react-table';
import MailPaperResponseDto from '../../../../../../../../utils/types/MailPaperResponseDto';
import { formatDateAndHourWithSlash } from '../../../../../../../../utils/functions/dates';
import TableComponent from '../../../../../../../../components/Table/Table';
import styles from './Table.module.scss';
import { HiPencilAlt } from 'react-icons/hi';
import { FaTrash } from 'react-icons/fa';
import { Link } from '@tanstack/react-router';

const route = '/app/tools/mails';

const columnHelper = createColumnHelper<MailPaperResponseDto>();
const columns = [
  columnHelper.display({
    header: 'Référence',
    cell: ({ row: { original } }) => (
      <Link from={route} to="show/$mailId" params={{ mailId: original.id }} search replace>
        {original.reference}
      </Link>
    ),
  }),
  columnHelper.display({
    header: 'Entreprise',
    cell: ({ row: { original } }) => original.enterpriseName,
  }),
  columnHelper.display({
    header: "Date d'édition",
    cell: ({ row: { original } }) => formatDateAndHourWithSlash(original.createdDate),
  }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row: { original } }) => (
      <div>
        <Link from={route} to="update/$mailId" params={{ mailId: original.id }} search replace resetScroll={false}>
          <HiPencilAlt width={18} height={18} color="#16204E" />
        </Link>
        <Link from={route} to="delete/$mailId" params={{ mailId: original.id }} search replace resetScroll={false} style={{ marginLeft: '5px' }}>
          <FaTrash width={18} height={18} color="#F24C52" />
        </Link>
      </div>
    ),
  }),
];

type AppViewToolsViewMailsViewTableComponentProps = Readonly<{
  data: Array<MailPaperResponseDto> | undefined;
  isLoading: boolean;
}>;
export default function AppViewToolsViewMailsViewTableComponent({ data, isLoading }: AppViewToolsViewMailsViewTableComponentProps) {
  return (
    <div className={styles.table_container}>
      <TableComponent columns={columns} data={data} isLoading={isLoading} />
    </div>
  );
}
