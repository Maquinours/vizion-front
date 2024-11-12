import { Link, getRouteApi } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import { BiEdit } from 'react-icons/bi';
import { FaTrash } from 'react-icons/fa';
import TableComponent from '../../../../../../../../components/Table/Table';
import PredefinedTextResponseDto from '../../../../../../../../utils/types/PredefinedTextResponseDto';
import styles from './Table.module.scss';

const routeApi = getRouteApi('/app/tools/predefined-texts');

export const columnHelper = createColumnHelper<PredefinedTextResponseDto>();
const columns = [
  columnHelper.display({
    header: 'Ordre',
    cell: ({ row: { original } }) => <div>{original.orderNum}</div>,
  }),
  columnHelper.display({
    header: 'Nom',
    cell: ({ row: { original } }) => <div>{original.title}</div>,
  }),
  columnHelper.display({
    header: 'Description',
    cell: ({ row: { original } }) => <div dangerouslySetInnerHTML={{ __html: original.description }} />,
  }),
  columnHelper.display({
    header: 'Actions',
    cell: ({ row: { original } }) => (
      <div>
        <Link from={routeApi.id} to="update/$predefinedTextId" params={{ predefinedTextId: original.id }} search replace resetScroll={false}>
          <BiEdit size={25} color="#31385A" />
        </Link>
        <Link from={routeApi.id} to="delete/$predefinedTextId" params={{ predefinedTextId: original.id }} search replace resetScroll={false}>
          <FaTrash size={25} color="#F24C52" />
        </Link>
      </div>
    ),
  }),
];

type AppViewToolsViewPredefinedTextsViewTableComponentProps = Readonly<{
  data: Array<PredefinedTextResponseDto> | undefined;
  isLoading: boolean;
}>;
export default function AppViewToolsViewPredefinedTextsViewTableComponent({ data, isLoading }: AppViewToolsViewPredefinedTextsViewTableComponentProps) {
  return (
    <div className={styles.table_container}>
      <TableComponent columns={columns} data={data} isLoading={isLoading} />
    </div>
  );
}
