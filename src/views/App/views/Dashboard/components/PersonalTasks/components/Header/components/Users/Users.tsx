import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import TaskState from '../../../../../../../../../../utils/enums/TaskState';
import { useAuthentifiedUserQuery } from '../../../../../../../../utils/functions/getAuthentifiedUser';
import styles from './Users.module.scss';

const routePath = '/app/dashboard';

export default function AppViewDashboardViewPersonalTasksComponentHeaderComponentUsersComponent() {
  const { data: user } = useAuthentifiedUserQuery();

  const { data: otherMembers } = useQuery({
    ...queries.profiles.list._ctx.byEnterpriseId(user.profile.enterprise!.id),
    select: (data) => data.filter((item) => item.id !== user.profile.id),
  });

  return (
    <div className={styles.users_container}>
      <div className={styles.others}>
        {otherMembers?.map((member) => (
          <Link
            key={member.id}
            from={routePath}
            to="./other-personal-tasks/$profileId"
            search={(old) => ({ ...old, otherPersonalTaskState: TaskState.CREATED, otherPersonalTaskSize: 10, otherPersonalTaskPage: 0 })}
            params={{ profileId: member.id }}
            replace
            resetScroll={false}
            preload="intent"
            className={styles.tag_tooltip}
          >
            {member.firstName?.charAt(0).toUpperCase()}
            {member.lastName?.charAt(0).toUpperCase()}
            <div className={styles.tag_content}>
              {member.firstName} {member.lastName}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
