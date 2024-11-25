import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { queries } from '../../../../utils/constants/queryKeys';
import { useAuthentifiedUserQuery } from '../../utils/functions/getAuthentifiedUser';
import { StompSessionProvider } from 'react-stomp-hooks';
import { WEBSOCKET_URL } from '../../../../utils/constants/api';
import AppViewTitleManagerComponentWebsocketComponent from './components/Websocket/Websocket';

const DEFAULT_TITLE = 'Vizion';

export default function AppViewTitleManagerComponent() {
  const { data: user } = useAuthentifiedUserQuery();

  const enabled = user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO');

  const { data: unreadTasksCount, refetch } = useQuery({
    ...queries.tasks.numbers._ctx.unreadsByProfileId(user.profile.id),
    enabled: enabled,
  });

  useEffect(() => {
    if (unreadTasksCount && unreadTasksCount > 0) {
      let currentType: 'INITIAL' | 'NOTIFICATION' = 'INITIAL';
      const intervalId = setInterval(() => {
        if (currentType === 'INITIAL') {
          document.title = `${unreadTasksCount} nouvelle${unreadTasksCount > 1 ? 's' : ''} tâche${unreadTasksCount > 1 ? 's' : ''}`;
          currentType = 'NOTIFICATION';
        } else if (currentType === 'NOTIFICATION') {
          document.title = DEFAULT_TITLE;
          currentType = 'INITIAL';
        }
      }, 1_000);
      return () => clearInterval(intervalId);
    } else document.title = DEFAULT_TITLE;
  }, [unreadTasksCount]);

  if (enabled)
    return (
      <StompSessionProvider url={WEBSOCKET_URL}>
        <AppViewTitleManagerComponentWebsocketComponent user={user} refetch={refetch} />
      </StompSessionProvider>
    );
  else return null;
}
