import AircallPhone from 'aircall-everywhere';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useWindowSize } from 'usehooks-ts';
import { AIRCALL_WEBSOCKET_URL } from '../../../../utils/constants/api';
import { toast } from 'react-toastify';
import AircallWebhookResponseDto from '../../../../utils/types/AircallWebhookResponseDto';
import { formatPhoneNumber } from 'react-phone-number-input';
import { useQueryClient } from '@tanstack/react-query';
import { queries } from '../../../../utils/constants/queryKeys';

const isCallEvent = (data: AircallWebhookResponseDto<'number' | 'user' | 'contact' | 'call'>): data is AircallWebhookResponseDto<'call'> => {
  return data.resource === 'call';
};

export default function AppViewAircallIntegrationComponent() {
  const queryClient = useQueryClient();

  const [show, setShow] = useState(false);
  const [pingInterval, setPingInterval] = useState<ReturnType<typeof setInterval>>();

  const { width: windowWidth, height: windowHeight } = useWindowSize();

  useEffect(() => {
    const phone = new AircallPhone({
      domToLoadPhone: '#phone',
      onLogin: (settings) => {
        console.log('onLogin', settings);
        // ...
      },
      onLogout: () => {
        console.log('onLogout');
        // ...
      },
    });

    phone.on('incoming_call', (callInfos) => {
      console.log('incoming_call', callInfos);
      setShow(true);
    });
    phone.on('call_end_ringtone', (callInfos) => {
      console.log('call_end_ringtone', callInfos);
    });
    phone.on('outgoing_call', (callInfos) => {
      console.log('outgoing_call', callInfos);
    });
    phone.on('outgoing_answered', (callInfos) => {
      console.log('outgoing_answered', callInfos);
    });
    phone.on('call_ended', (callInfos) => {
      console.log('call_ended', callInfos);
    });
    phone.on('comment_saved', (callInfos) => {
      console.log('comment_saved', callInfos);
    });
    phone.on('redirect_event', (callInfos) => {
      console.log('redirect_event', callInfos);
    });

    return () => {
      phone.removeListener('incoming_call');
      phone.removeListener('call_end_ringtone');
      phone.removeListener('outgoing_call');
      phone.removeListener('outgoing_answered');
      phone.removeListener('call_ended');
      phone.removeListener('comment_saved');
      phone.removeListener('redirect_event');
    };
  }, []);

  const onClick = () => {
    setShow(!show);
  };

  const { sendMessage, readyState } = useWebSocket(
    AIRCALL_WEBSOCKET_URL,
    {
      onOpen: () => {
        console.log('Aircall websocket connected');
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
        if (!isCallEvent(data)) return;
        switch (data.event) {
          case 'call.created':
            queryClient.prefetchQuery(
              queries.profiles.detail._ctx.byPhoneNumbers([data.data.number.e164_digits, formatPhoneNumber(data.data.number.e164_digits)]),
            );
            break;
          case 'call.answered':
            toast.info(`${data.data.user.name} a répondu à l'appel du ${data.data.number.e164_digits}`);
            queryClient
              .ensureQueryData(queries.profiles.detail._ctx.byPhoneNumbers([data.data.number.e164_digits, formatPhoneNumber(data.data.number.e164_digits)]))
              .then((profile) => {
                console.log(`profile with phone number ${data.data.number.e164_digits}`, profile);
              })
              .catch((error) => {
                console.log(`error fetching profile with phone number ${data.data.number.e164_digits}`, error);
              });
            break;
        }
      },
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

  return (
    <div className={classNames('fixed bottom-0 right-0 z-50 m-4 flex flex-col items-end', { hidden: windowWidth < 400 || windowHeight < 800 })}>
      <div id="phone" className={classNames('rounded border border-solid border-[var(--grey-line)] bg-white shadow', { hidden: !show })}></div>
      <div className={classNames('w-8', { hidden: !show })}>
        <div className="m-auto h-0 w-0 border-x-8 border-t-8 border-solid border-x-transparent border-t-[var(--primary-color)]" />
      </div>
      <button type="button" onClick={onClick} className={classNames({ hidden: windowWidth < 400 || windowHeight < 800 })}>
        <img src="https://aircall.github.io/aircall-everywhere/images/aircall-icon.svg" alt="Logo Aircall" width={32} height={32} />
      </button>
    </div>
  );
}
