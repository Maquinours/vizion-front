import { useQuery } from '@tanstack/react-query';
import styles from './Users.module.scss';
import { getRouteApi } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../../../../../utils/functions/getAuthentifiedUser';
import { profileQueryKeys } from '../../../../../../../../../../utils/constants/queryKeys/profile';
import { getProfilesByEnterpriseId } from '../../../../../../../../../../utils/api/profile';
import { Link } from '@tanstack/react-router';
import classNames from 'classnames';

const Route = getRouteApi('/app/dashboard/other-personal-tasks/$profileId');

export default function AppViewDashboardViewOtherPersonalTasksModalViewHeaderComponentUsersComponent() {
  const { data: user } = useAuthentifiedUserQuery();

  const { profileId } = Route.useParams();

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
            search={(old) => old}
            params={{ profileId: member.id }}
            className={classNames(styles.tag_tooltip, { [styles.selected]: member.id === profileId })}
            preload="intent"
            replace
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
