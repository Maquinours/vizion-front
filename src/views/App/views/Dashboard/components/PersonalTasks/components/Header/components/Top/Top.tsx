import { BsFillCircleFill } from 'react-icons/bs';
import classNames from 'classnames';
import { AiFillTag } from 'react-icons/ai';
import styles from './Top.module.scss';
import TaskState from '../../../../../../../../../../utils/enums/TaskState';
import { Link, getRouteApi } from '@tanstack/react-router';
import TasksCountsResponseDto from '../../../../../../../../../../utils/types/TasksCountsResponseDto';

const routeApi = getRouteApi('/app/dashboard');

const STATES: Array<{ value: TaskState; color: string; label: string; countField?: 'created' | 'closed' }> = [
  {
    value: TaskState.CREATED,
    color: '#F24C52',
    label: 'Créée',
    countField: 'created',
  },
  {
    value: TaskState.CLOSED,
    color: '#31385A',
    label: 'En attente',
    countField: 'closed',
  },
  {
    value: TaskState.ARCHIVED,
    color: '#5DC896',
    label: 'Archivé',
  },
];

type Props = Readonly<{
  counts: TasksCountsResponseDto | undefined;
}>;
export default function AppViewDashboardViewPersonalTasksComponentHeaderComponentTopComponent({ counts }: Props) {
  const { personalTaskState: state } = routeApi.useSearch();

  return (
    <div className={styles.top_container}>
      <div className={styles.state_container}>
        {STATES.map((item) => (
          <Link
            key={item.value}
            from={routeApi.id}
            search={(old) => ({ ...old, personalTaskState: item.value, personalTaskPage: 0 })}
            replace
            resetScroll={false}
            preload="intent"
            className={styles.tag_tooltip}
          >
            <div className="flex flex-col items-center">
              <BsFillCircleFill color={item.color} className={classNames(styles.icon, { [styles.isActive]: item.value === state })} />
              {counts && item.countField && (
                <span className={classNames('absolute text-sm text-(--white-color)', { 'leading-[22px]': item.value === state })}>
                  {counts[item.countField]}
                </span>
              )}
            </div>
            <div className={styles.tag_content}>{item.label}</div>
          </Link>
        ))}
      </div>
      <div className={styles.tag_container}>
        <h5>Tags :</h5>
        <div className={styles.tag_tooltip}>
          <AiFillTag color="#5DC896" size={18} />
          <div className={styles.tag_content}>{"En attente d'archivage"}</div>
        </div>
        <div className={styles.tag_tooltip}>
          <AiFillTag color="#F24C52" size={18} />
          <div className={styles.tag_content}>À archiver</div>
        </div>
      </div>
    </div>
  );
}
