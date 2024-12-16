import { useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import classNames from 'classnames';
import { PulseLoader } from 'react-spinners';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import styles from './Comments.module.scss';

const routeApi = getRouteApi('/app/dashboard/task-comments/$taskId');

export default function AppViewDashboardViewTaskCommentsModalViewCommentsComponent() {
  const { taskId } = routeApi.useParams();

  const { data: currentUser } = useAuthentifiedUserQuery();

  const { data, isLoading } = useQuery({
    ...queries['task-comments'].list._ctx.byTaskId(taskId),
    select: (comments) => [...comments].reverse(),
  });

  const content = (() => {
    if (!data) return;
    if (data.length === 0) return <div className={styles.no_comment}>Aucun commentaire</div>;
    return data.map((item) => (
      <div
        key={item.id}
        className={classNames(styles.comment_card, {
          [styles.isRight]: item.createdBy === currentUser?.userInfo?.id,
        })}
      >
        <div className={styles.author}>{item.createdBy === currentUser?.userInfo?.id ? 'Vous' : item.author}</div>
        <div className={styles.comment}>{item.comment}</div>
      </div>
    ));
  })();

  return (
    <div className={styles.modal_content}>
      <div className={styles.comment_loader}>
        <PulseLoader color="#31385A" loading={isLoading} size={10} speedMultiplier={0.5} />
      </div>
      {content}
    </div>
  );
}
