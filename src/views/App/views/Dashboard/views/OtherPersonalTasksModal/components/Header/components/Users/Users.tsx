import { useQuery } from '@tanstack/react-query';
import { Link, getRouteApi } from '@tanstack/react-router';
import classNames from 'classnames';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import { useAuthentifiedUserQuery } from '../../../../../../../../utils/functions/getAuthentifiedUser';
import styles from './Users.module.scss';

const Route = getRouteApi('/app/dashboard/other-personal-tasks/$profileId');

export default function AppViewDashboardViewOtherPersonalTasksModalViewHeaderComponentUsersComponent() {
  const { data: user } = useAuthentifiedUserQuery();

  const { profileId } = Route.useParams();

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
            from={Route.id}
            search={(old) => old}
            params={{ profileId: member.id }}
            className={classNames(styles.tag_tooltip, { [styles.selected]: member.id === profileId })}
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
