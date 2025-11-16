import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { useEffect, useMemo, useState } from 'react';
import { isAxiosError } from 'axios';
import { useMemo } from 'react';
import { formatPhoneNumber } from 'react-phone-number-input';
import { toast, ToastContentProps } from 'react-toastify';
import useWebSocket from 'react-use-websocket';
import AircallIcon from '../../../../assets/images/aircall-icon.svg?react';
import { AIRCALL_WEBSOCKET_URL } from '../../../../utils/constants/api';
import { queries } from '../../../../utils/constants/queryKeys';
import { aircallQueryKeys } from '../../../../utils/constants/queryKeys/aircall';
import AircallWebhookResponseDto from '../../../../utils/types/AircallWebhookResponseDto';
import ProfileResponseDto from '../../../../utils/types/ProfileResponseDto';
import { useAuthentifiedUserQuery } from '../../utils/functions/getAuthentifiedUser';

type AircallNewCallToastComponentProps = ToastContentProps<{
  caller: ProfileResponseDto;
}>;
const AircallNewCallToastComponent = ({ data }: AircallNewCallToastComponentProps) => {
  return (
    <div className="flex flex-col pl-12">
      <AircallIcon className="absolute top-1/2 left-2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-r text-white shadow-lg" />
      <p className="font-semibold text-(--primary-color)">
        {data.caller.firstName} {data.caller.lastName}
      </p>
      <p className="text-sm text-zinc-400">
        Vous avez répondu à l&apos;appel de {data.caller.firstName} {data.caller.lastName}
        {data.caller.enterprise ? ` de l'entreprise ${data.caller.enterprise.name}` : ''}
      </p>
    </div>
  );
};

const isCallEvent = (data: AircallWebhookResponseDto<'number' | 'user' | 'contact' | 'call'>): data is AircallWebhookResponseDto<'call'> => {
  return data.resource === 'call';
};

const isUserEvent = (data: AircallWebhookResponseDto<'number' | 'user' | 'contact' | 'call'>): data is AircallWebhookResponseDto<'user'> => {
  return data.resource === 'user';
};

type AppViewAircallIntegrationComponentProps = Readonly<{
  openEnterpriseModal: (enterpriseId: string, filter: { defaultContactsSearch?: string; defaultAllBusinessProfileId?: string }) => void;
}>;
export default function AppViewAircallIntegrationComponent({ openEnterpriseModal }: AppViewAircallIntegrationComponentProps) {
  const queryClient = useQueryClient();
  // const navigate = useNavigate();

  const { data: currentUser } = useAuthentifiedUserQuery();

  const { data: users } = useQuery({
    ...aircallQueryKeys.allUsers,
    select: (data) => data.users,
    staleTime: Infinity,
    enabled: false,
  });

  const shouldConnect = useMemo(
    () =>
      !users ||
      users.some(
        (user) => user.name.trim().toLowerCase() === `${currentUser.userInfo.firstName.trim()} ${currentUser.userInfo.lastName.trim()}`.trim().toLowerCase(),
      ),
    [users, currentUser],
  );

  useWebSocket(
    AIRCALL_WEBSOCKET_URL,
    {
      onOpen: () => {
        console.log('Aircall websocket connected');
        queryClient.invalidateQueries({ queryKey: aircallQueryKeys.availabilities.queryKey });
      },
      onClose: () => {
        console.log('Aircall websocket closed');
      },
      onError: (error) => {
        console.log('Aircall websocket error', error);
      },
      onMessage: (message) => {
        if (message.data === 'pong') return;
        const data = JSON.parse(message.data) as AircallWebhookResponseDto<'number' | 'user' | 'contact' | 'call'>;
        console.log('Aircall websocket message', data);
        if (isUserEvent(data)) queryClient.invalidateQueries({ queryKey: aircallQueryKeys.availabilities.queryKey });
        else if (isCallEvent(data))
          switch (data.event) {
            case 'call.created':
              if (data.data.direction === 'inbound')
                queryClient.prefetchQuery(queries.profiles.detail._ctx.byPhoneNumbers([data.data.raw_digits, formatPhoneNumber(data.data.raw_digits)]));
              break;
            case 'call.answered':
            case 'call.transferred':
              queryClient.invalidateQueries({ queryKey: aircallQueryKeys.availabilities.queryKey });
              if (
                data.data.direction === 'inbound' &&
                data.data.user?.name?.toLowerCase().trim() ===
                  `${currentUser.profile.firstName?.trim() ?? ''} ${currentUser.profile.lastName?.trim() ?? ''}`.toLowerCase().trim()
              ) {
                queryClient
                  .ensureQueryData(queries.profiles.detail._ctx.byPhoneNumbers([data.data.raw_digits, formatPhoneNumber(data.data.raw_digits)]))
                  .then((profile) => {
                    if (!profile.enterprise) return;
                    const enterprise = profile.enterprise;
                    toast(AircallNewCallToastComponent, { data: { caller: profile }, autoClose: 5_000 });
                    queryClient
                      .ensureQueryData(
                        queries['all-businesses'].page._ctx.byEnterpriseIdAndPossibleProfileId({ enterpriseId: enterprise.id, page: 0, size: 15 }),
                      )
                      .then((allBusinesses) => {
                        openEnterpriseModal(enterprise.id, {
                          defaultContactsSearch: `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim(),
                          defaultAllBusinessProfileId: allBusinesses.totalElements > 15 ? profile.id : undefined,
                        });
                        // navigate({
                        //   to: '/app/enterprises/$enterpriseId',
                        //   params: { enterpriseId: enterprise.id },
                        //   search: {
                        //     contactsSearch: `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim(),
                        //     allBusinessProfileId: allBusinesses.totalElements > 15 ? profile.id : undefined, // We filter by the profile only if there is less or equal than 15 businesses
                        //   },
                        // });
                      })
                      .catch((error) => {
                        toast.error(`Erreur lors de la récupération des affaires de l'entreprise ${enterprise.name}`);
                        console.log(`error loading allBusinesses from enterprise ${enterprise.name}`, error);
                      });
                  })
                  .catch((error) => {
                    if (isAxiosError(error) && error.response?.status === 404) {
                      toast.info(`Aucun profil trouvé pour le numéro appelant ${data.data.raw_digits}`);
                      // navigate({ to: '/app/enterprises' });
                    } else toast.error(`Erreur lors de la récupération du profil avec le numéro appelant ${data.data.raw_digits}`);
                    console.log(`error fetching profile with phone number ${data.data.raw_digits}`, error);
                  });
              }
              break;
            case 'call.ended':
            case 'call.hungup':
              queryClient.invalidateQueries({ queryKey: aircallQueryKeys.availabilities.queryKey });
              break;
          }
      },
      retryOnError: true,
      shouldReconnect: () => true,
      reconnectAttempts: Infinity,
      reconnectInterval: (attemptNumber) => Math.min(Math.pow(2, attemptNumber) * 1000, 10000),
      heartbeat: {
        message: 'ping',
        interval: 15_000,
        returnMessage: 'pong',
        timeout: 60_000,
      },
    },
    shouldConnect,
  );

  return null;
}
