import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { aircallQueryKeys } from '../../../../../../../../utils/constants/queryKeys/aircall';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';

export default function AppLayoutTopbarComponentBasicTopbarComponentAircallUsersComponent() {
  const { data: currentUser } = useAuthentifiedUserQuery();

  const [isQueryEnabled, setIsQueryEnabled] = useState(true);

  const { data: users } = useQuery({
    ...aircallQueryKeys.allUsers,
    select: (data) => data.users,
    staleTime: Infinity,
    enabled: isQueryEnabled,
  });

  useEffect(() => {
    const enabled =
      !users ||
      users.some(
        (user) => user.name.trim().toLowerCase() === `${currentUser.userInfo.firstName.trim()} ${currentUser.userInfo.lastName.trim()}`.trim().toLowerCase(),
      );
    setIsQueryEnabled(enabled);
  }, [users, currentUser]);

  if (
    !users ||
    !users.some(
      (user) => user.name.trim().toLowerCase() === `${currentUser.userInfo.firstName.trim()} ${currentUser.userInfo.lastName.trim()}`.trim().toLowerCase(),
    )
  )
    return null;

  return (
    <div className="flex flex-row gap-x-1">
      {users.map((user) => (
        <React.Fragment key={user.id}>
          <div
            className={classNames('rounded-lg p-1 text-white', {
              'bg-green-400': user.available,
              'bg-red-400': !user.available,
            })}
            data-tooltip-id={`aircall-user-${user.id}`}
            data-tooltip-content={`${user.name} - ${user.available ? 'Disponible' : 'Indisponible'}`}
          >
            {user.name
              .split(' ')
              .map((i) => i[0].toUpperCase())
              .join('')}
          </div>
          <Tooltip id={`aircall-user-${user.id}`} />
        </React.Fragment>
      ))}
    </div>
  );
}
