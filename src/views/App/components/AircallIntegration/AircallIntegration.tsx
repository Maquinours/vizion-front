import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { formatPhoneNumber } from 'react-phone-number-input';
import { toast } from 'react-toastify';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { AIRCALL_WEBSOCKET_URL } from '../../../../utils/constants/api';
import { queries } from '../../../../utils/constants/queryKeys';
import { aircallQueryKeys } from '../../../../utils/constants/queryKeys/aircall';
import AircallWebhookResponseDto from '../../../../utils/types/AircallWebhookResponseDto';
import { useNavigate } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import { useAuthentifiedUserQuery } from '../../utils/functions/getAuthentifiedUser';

const isCallEvent = (data: AircallWebhookResponseDto<'number' | 'user' | 'contact' | 'call'>): data is AircallWebhookResponseDto<'call'> => {
  return data.resource === 'call';
};

const isUserEvent = (data: AircallWebhookResponseDto<'number' | 'user' | 'contact' | 'call'>): data is AircallWebhookResponseDto<'user'> => {
  return data.resource === 'user';
};

export default function AppViewAircallIntegrationComponent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: user } = useAuthentifiedUserQuery();

  const [pingInterval, setPingInterval] = useState<ReturnType<typeof setInterval>>();

  const { sendMessage, readyState } = useWebSocket(
    AIRCALL_WEBSOCKET_URL,
    {
      onOpen: () => {
        console.log('Aircall websocket connected');
        queryClient.invalidateQueries({ queryKey: aircallQueryKeys.allUsers.queryKey });
      },
      onClose: () => {
        console.log('Aircall websocket closed');
        if (pingInterval) {
          clearInterval(pingInterval);
          setPingInterval(undefined);
        }
      },
      onError: (error) => {
        console.log('Aircall websocket error', error);
      },
      onMessage: (message) => {
        const data = JSON.parse(message.data) as AircallWebhookResponseDto<'number' | 'user' | 'contact' | 'call'>;
        console.log('Aircall websocket message', data);
        if (isUserEvent(data)) queryClient.invalidateQueries({ queryKey: aircallQueryKeys.allUsers.queryKey });
        else if (isCallEvent(data))
          switch (data.event) {
            case 'call.created':
              if (data.data.direction === 'inbound')
                queryClient.prefetchQuery(queries.profiles.detail._ctx.byPhoneNumbers([data.data.raw_digits, formatPhoneNumber(data.data.raw_digits)]));
              break;
            case 'call.answered':
              queryClient.invalidateQueries({ queryKey: aircallQueryKeys.allUsers.queryKey });
              if (
                data.data.direction === 'inbound' &&
                data.data.user?.name?.toLowerCase().trim() ===
                  `${user.profile.firstName?.trim() ?? ''} ${user.profile.lastName?.trim() ?? ''}`.toLowerCase().trim()
              ) {
                queryClient
                  .ensureQueryData(queries.profiles.detail._ctx.byPhoneNumbers([data.data.raw_digits, formatPhoneNumber(data.data.raw_digits)]))
                  .then((profile) => {
                    if (!profile.enterprise) return;
                    toast.info(`Vous avez répondu à l'appel de ${profile.firstName} ${profile.lastName} de l'entreprise ${profile.enterprise.name}`);
                    navigate({
                      to: '/app/enterprises/$enterpriseId',
                      params: { enterpriseId: profile.enterprise.id },
                      search: { contactsSearch: `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim() },
                    });
                  })
                  .catch((error) => {
                    if (isAxiosError(error) && error.response?.status === 404) {
                      toast.info(`Aucun profil trouvé pour le numéro appelant ${data.data.raw_digits}`);
                      navigate({ to: '/app/enterprises' });
                    } else toast.error(`Erreur lors de la récupération du profil avec le numéro appelant ${data.data.raw_digits}`);
                    console.log(`error fetching profile with phone number ${data.data.raw_digits}`, error);
                  });
              }
              break;
            case 'call.ended':
            case 'call.hungup':
            case 'call.transferred':
              queryClient.invalidateQueries({ queryKey: aircallQueryKeys.allUsers.queryKey });
              break;
          }
      },
      retryOnError: true,
      shouldReconnect: () => true,
      reconnectAttempts: Infinity,
      reconnectInterval: (attemptNumber) => Math.min(Math.pow(2, attemptNumber) * 1000, 10000),
    },
    true,
  );

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      setPingInterval(
        setInterval(() => {
          sendMessage('ping');
        }, 30000),
      );
      return () => {
        clearInterval(pingInterval);
      };
    }
  }, [readyState]);

  return null;
}
