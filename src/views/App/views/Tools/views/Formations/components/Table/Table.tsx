import { createColumnHelper } from '@tanstack/react-table';
import FormationResponseDto from '../../../../../../../../utils/types/FormationResponseDto';
import TableRowExpandButtonComponent from '../../../../../../../../components/TableRowExpandButton/TableRowExpandButton';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import styles from './Table.module.scss';
import { FILE_READ_STORAGE_BASE_URL } from '../../../../../../../../utils/constants/api';
import { BsFillCircleFill } from 'react-icons/bs';
import TableComponent from '../../../../../../../../components/Table/Table';
import AppViewToolsViewFormationsViewTableComponentSubRowComponent from './components/SubRow/SubRow';
import { Link, getRouteApi } from '@tanstack/react-router';
import { FaTrash, FaUsers } from 'react-icons/fa';
import { BiEdit } from 'react-icons/bi';

const routeApi = getRouteApi('/app/tools/formations');

const columnHelper = createColumnHelper<FormationResponseDto>();
const columns = [
  columnHelper.display({
    id: 'expand',
    cell: TableRowExpandButtonComponent,
  }),
  columnHelper.display({
    header: 'Titre',
    cell: ({ row }) => row.original.title,
  }),
  columnHelper.display({
    header: 'Sous titre',
    cell: ({ row }) => row.original.subtitle,
  }),
  columnHelper.display({
    header: 'Détails',
    cell: ({ row: { original } }) => (
      <div className={styles.details_container}>
        {original?.formationDetails?.map((item, key) => {
          const date = new Date(item.formationDate!);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const day = date.getDate();
          const startHour = Number(item?.startTime?.split(':')[0]);
          const endHour = Number(item?.endTime?.split(':')[0]);
          const currentStartTime = new Date(year, month, day, startHour);
          const currentEndTime = new Date(year, month, day, endHour);

          const trainersList = Object.values(item.trainers!);
          return (
            <div key={key} className={styles.details_content}>
              <div className={styles.title}>{item.title}</div>
              <div className={styles.date}>
                {format(new Date(item.formationDate!), 'cccc, dd MMMM yyyy', {
                  locale: fr,
                })}{' '}
                {format(new Date(currentStartTime), 'HH')}h - {format(new Date(currentEndTime), 'HH')}h
              </div>
              <div className={styles.trainer_container}>
                <ul>
                  {trainersList.map((trainer, key) => (
                    <li key={key}>{trainer.label}</li>
                  ))}
                </ul>
              </div>
              <Link
                from={routeApi.id}
                to="subscribers/$formationDetailId"
                params={{ formationDetailId: item.id }}
                search
                replace
                className={styles.registrants}
              >
                Les inscrits <FaUsers size={25} />
              </Link>
            </div>
          );
        })}
      </div>
    ),
  }),
  columnHelper.display({
    header: 'Fichiers associés',
    cell: ({ row: { original } }) => {
      const files = Object.values(original.files!);
      if (files.length > 0)
        return (
          <ul>
            {files.map((file, index) => (
              <li key={file.path} style={{ marginBottom: '5px', cursor: 'pointer' }}>
                <a href={`${FILE_READ_STORAGE_BASE_URL}/${file.name}`} target="_blank" rel="noreferrer">
                  Fichier {index + 1}
                </a>
              </li>
            ))}
          </ul>
        );
      return <p>Aucun fichier</p>;
    },
  }),
  columnHelper.display({
    header: 'Etat',
    cell: ({ row: { original } }) => (
      <BsFillCircleFill color={original.archived ? '#F24C52' : '#5DC896'} title={original.archived ? 'Archivé' : 'Non archivé'} size={20} />
    ),
  }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row: { original } }) => (
      <div className={styles.action_buttons}>
        <Link from={routeApi.id} to="update/$formationId" params={{ formationId: original.id }} search replace resetScroll={false}>
          <BiEdit size={25} color="#31385A" />
        </Link>
        <Link from={routeApi.id} to="delete/$formationId" params={{ formationId: original.id }} search replace resetScroll={false}>
          <FaTrash width="25" height="25" color="#F24C52" />
        </Link>
      </div>
    ),
  }),
];

type AppViewToolsViewFormationsViewTableComponentProps = {
  data: Array<FormationResponseDto> | undefined;
  isLoading: boolean;
};
export default function AppViewToolsViewFormationsViewTableComponent({ data, isLoading }: AppViewToolsViewFormationsViewTableComponentProps) {
  return (
    <div className={styles.table_container}>
      <TableComponent
        columns={columns}
        data={data}
        isLoading={isLoading}
        getRowCanExpand={() => true}
        renderSubComponent={AppViewToolsViewFormationsViewTableComponentSubRowComponent}
      />
    </div>
  );
}
