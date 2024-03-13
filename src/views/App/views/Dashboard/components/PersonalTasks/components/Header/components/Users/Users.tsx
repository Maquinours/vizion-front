import { useQuery } from '@tanstack/react-query';
import styles from './Users.module.scss';
import { Link, getRouteApi } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../../../../../utils/functions/getAuthentifiedUser';
import { profileQueryKeys } from '../../../../../../../../../../utils/constants/queryKeys/profile';
import { getProfilesByEnterpriseId } from '../../../../../../../../../../utils/api/profile';
import TaskState from '../../../../../../../../../../utils/enums/TaskState';

const Route = getRouteApi('/app/dashboard');

export default function AppViewDashboardViewPersonalTasksComponentHeaderComponentUsersComponent() {
  const { data: user } = useAuthentifiedUserQuery();

  const { data: otherMembers } = useQuery({
    queryKey: profileQueryKeys.listByEnterpriseId(user.profile.enterprise!.id),
    queryFn: () => getProfilesByEnterpriseId(user.profile.enterprise!.id),
    select: (data) => data.filter((item) => item.id !== user.profile.id),
  });

  return (
    <div className={styles.users_container}>
      <div className={styles.others}>
        {otherMembers?.map((member) => (
          <Link
            key={member.id}
            from={Route.id}
            to="./other-personal-tasks/$profileId"
            search={(old) => ({ ...old, otherPersonalTaskState: TaskState.CREATED, otherPersonalTaskSize: 10, otherPersonalTaskPage: 0 })}
            params={{ profileId: member.id }}
            preload="intent"
            replace
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
