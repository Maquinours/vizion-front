import { createColumnHelper } from '@tanstack/react-table';
import NewsResponseDto from '../../../../../../../../utils/types/NewsResponseDto';
import UploadedFile from '../../../../../../../../utils/types/UploadedFile';
import { BsFillCircleFill } from 'react-icons/bs';
import { formatDateWithSlash } from '../../../../../../../../utils/functions/dates';
import { BiEdit } from 'react-icons/bi';
import { FaTrash } from 'react-icons/fa';
import TableRowExpandButtonComponent from '../../../../../../../../components/TableRowExpandButton/TableRowExpandButton';
import { FILE_READ_STORAGE_BASE_URL } from '../../../../../../../../utils/constants/api';
import { Link, getRouteApi } from '@tanstack/react-router';
import TableComponent from '../../../../../../../../components/Table/Table';
import AppViewToolsViewNewsViewTableComponentSubRowComponent from './components/SubRow/SubRow';
import styles from './Table.module.scss';

const routeApi = getRouteApi('/app/tools/news');

const columnHelper = createColumnHelper<NewsResponseDto>();
const columns = [
  columnHelper.display({
    header: '',
    id: 'more',
    cell: ({ row }) => (
      <div className={styles.sub_component}>
        <TableRowExpandButtonComponent row={row} />
      </div>
    ),
  }),
  columnHelper.display({
    header: 'Titre',
    cell: ({ row: { original } }) => original.title,
  }),
  columnHelper.display({
    header: 'Sous-titre',
    cell: ({ row: { original } }) => original.subtitle,
  }),
  columnHelper.display({
    header: 'Fichiers associés',
    cell: ({ row: { original } }) => {
      const files = (original.files ? Object.values(original.files) : []) as Array<UploadedFile>;
      return files.length > 0 ? (
        <ul>
          {files.map((item, index) => (
            <li key={item.name}>
              <a href={`${FILE_READ_STORAGE_BASE_URL}/${item.name}`} target="_blank" rel="noreferrer">
                Fichier {index + 1}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        'Aucune pièce jointe'
      );
    },
  }),
  columnHelper.display({
    header: 'Etat',
    cell: ({ row: { original } }) => <BsFillCircleFill color={original.archived ? '#F24C52' : '#5DC896'} height={20} width={20} />,
  }),
  columnHelper.display({
    header: 'Date de création',
    cell: ({ row: { original } }) => formatDateWithSlash(original.createdDate),
  }),
  columnHelper.display({
    header: 'Date de modification',
    cell: ({ row: { original } }) => formatDateWithSlash(original.modifiedDate),
  }),
  columnHelper.display({
    header: '',
    id: 'actions',
    cell: ({ row: { original } }) => (
      <div className={styles.action_buttons}>
        <Link from={routeApi.id} to="./update/$newsId" params={{ newsId: original.id }} search replace resetScroll={false}>
          <BiEdit size={25} color="#31385A" />
        </Link>
        <Link from={routeApi.id} to="./delete/$newsId" params={{ newsId: original.id }} search replace resetScroll={false}>
          <FaTrash width={25} height={25} color="#F24C52" />
        </Link>
      </div>
    ),
  }),
];

type AppViewToolsViewNewsViewTableComponentProps = Readonly<{
  data: Array<NewsResponseDto> | undefined;
  isLoading: boolean;
}>;
export default function AppViewToolsViewNewsViewTableComponent({ data, isLoading }: AppViewToolsViewNewsViewTableComponentProps) {
  return (
    <div className={styles.table_container}>
      <TableComponent
        columns={columns}
        data={data}
        isLoading={isLoading}
        getRowCanExpand={() => true}
        renderSubComponent={AppViewToolsViewNewsViewTableComponentSubRowComponent}
      />
    </div>
  );
}
