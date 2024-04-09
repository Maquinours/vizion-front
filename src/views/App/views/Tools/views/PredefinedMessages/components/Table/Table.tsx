import { createColumnHelper } from '@tanstack/react-table';
import PredefinedMessageResponseDto from '../../../../../../../../utils/types/PredefinedMessageResponseDto';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import { BiEdit } from 'react-icons/bi';
import { FaTrash } from 'react-icons/fa';
import { Link, getRouteApi } from '@tanstack/react-router';
import TableComponent from '../../../../../../../../components/Table/Table';
import styles from './Table.module.scss';

const routeApi = getRouteApi('/app/tools/predefined-messages');

const columnHelper = createColumnHelper<PredefinedMessageResponseDto>();
const columns = [
  columnHelper.display({
    header: 'Nom',
    cell: ({ row: { original } }) => original.title,
  }),
  columnHelper.display({
    header: 'Description',
    cell: ({ row: { original } }) => parse(DOMPurify.sanitize(original.description)),
  }),
  columnHelper.display({
    header: 'Actions',
    cell: ({ row: { original } }) => (
      <div>
        <Link from={routeApi.id} to={'./update/$predefinedMessageId'} params={{ predefinedMessageId: original.id }} search={(old) => old}>
          <BiEdit size={25} color="#31385A" />
        </Link>
        <Link from={routeApi.id} to={'./delete/$predefinedMessageId'} params={{ predefinedMessageId: original.id }} search={(old) => old}>
          <FaTrash size={25} color="#F24C52" />
        </Link>
      </div>
    ),
  }),
];

type AppViewToolsViewPredefinedMessagesViewTableComponentProps = Readonly<{
  data: Array<PredefinedMessageResponseDto> | undefined;
  isLoading: boolean;
}>;
export default function AppViewToolsViewPredefinedMessagesViewTableComponent({ data, isLoading }: AppViewToolsViewPredefinedMessagesViewTableComponentProps) {
  return (
    <div className={styles.table_container}>
      <TableComponent columns={columns} data={data} isLoading={isLoading} />
    </div>
  );
}
