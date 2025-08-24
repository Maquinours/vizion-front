import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { aircallQueryKeys } from '../../../../../../../../utils/constants/queryKeys/aircall';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';

const AVAILABILITY_DATA = [
  { name: 'Disponible', value: 'available', backgroundColor: 'bg-green-400' },
  { name: 'Déconnecté', value: 'offline', backgroundColor: 'bg-gray-400' },
  { name: 'En appel', value: 'in_call', backgroundColor: 'bg-red-400' },
  { name: 'Ne pas déra nger', value: 'do_not_disturb', backgroundColor: 'bg-yellow-400' },
];

export default function AppLayoutTopbarComponentBasicTopbarComponentAircallUsersComponent() {
  const { data: currentUser } = useAuthentifiedUserQuery();

  const [isQueryEnabled, setIsQueryEnabled] = useState(true);

  const { data: users } = useQuery({
    ...aircallQueryKeys.allUsers,
    select: (data) => data.users,
    staleTime: Infinity,
  });

  const { data: availabilities } = useQuery({
    ...aircallQueryKeys.availabilities._ctx.list,
    select: (data) => data.users,
    staleTime: Infinity,
    enabled: isQueryEnabled,
  });

  const usersData = users?.map((user) => ({ ...user, availability_status: availabilities?.find((availability) => availability.id === user.id)?.availability }));

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
      {usersData?.map((user) => {
        const availabilityData = AVAILABILITY_DATA.find((data) => data.value === user.availability_status);
        return (
          <React.Fragment key={user.id}>
            <div
              className={classNames('rounded-lg p-1 text-white', availabilityData?.backgroundColor)}
              data-tooltip-id={`aircall-user-${user.id}`}
              data-tooltip-content={`${user.name} - ${availabilityData?.name}`}
            >
              {user.name
                .split(' ')
                .map((i) => i[0].toUpperCase())
                .join('')}
            </div>
            <Tooltip id={`aircall-user-${user.id}`} />
          </React.Fragment>
        );
      })}
    </div>
  );
}
