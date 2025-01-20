import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { aircallQueryKeys } from '../../../../../../../../utils/constants/queryKeys/aircall';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import React from 'react';
import { Tooltip } from 'react-tooltip';

export default function AppLayoutTopbarComponentBasicTopbarComponentAircallUsersComponent() {
  const { data: currentUser } = useAuthentifiedUserQuery();
  const { data: users } = useQuery({
    ...aircallQueryKeys.allUsers,
    select: (data) =>
      data.users.filter((user) => user.name.toLowerCase() !== `${currentUser.userInfo.firstName} ${currentUser.userInfo.lastName}`.toLowerCase()),
    staleTime: Infinity,
  });

  return (
    <div className="flex flex-row gap-x-1">
      {users?.map((user) => (
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
