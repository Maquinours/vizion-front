import { BsFillCircleFill } from 'react-icons/bs';
import classNames from 'classnames';
import { AiFillTag } from 'react-icons/ai';
import styles from './Top.module.scss';
import TaskState from '../../../../../../../../../../utils/enums/TaskState';
import { Link, getRouteApi } from '@tanstack/react-router';

const Route = getRouteApi('/app/dashboard/other-personal-tasks/$profileId');

const STATES = [
  {
    value: TaskState.CREATED,
    color: '#F24C52',
    label: 'Créée',
  },
  {
    value: TaskState.CLOSED,
    color: '#31385A',
    label: 'En attente',
  },
  {
    value: TaskState.ARCHIVED,
    color: '#5DC896',
    label: 'Archivé',
  },
];

export default function AppViewDashboardViewOtherPersonalTasksModalViewHeaderComponentTopComponent() {
  const { otherPersonalTaskState: state } = Route.useSearch();

  return (
    <div className={styles.top_container}>
      <div className={styles.state_container}>
        {STATES.map((item) => (
          <Link
            key={item.value}
            from={Route.id}
            search={(old) => ({ ...old, otherPersonalTaskState: item.value, otherPersonalTaskPage: 0 })}
            replace
            resetScroll={false}
            preload="intent"
            className={styles.tag_tooltip}
          >
            <BsFillCircleFill color={item.color} className={classNames(styles.icon, { [styles.isActive]: item.value === state })} />
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
