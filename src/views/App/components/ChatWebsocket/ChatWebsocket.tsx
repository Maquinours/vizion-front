import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'react-toastify';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { CHAT_WEBSOCKET_URL } from '../../../../utils/constants/api';
import { queries } from '../../../../utils/constants/queryKeys';
import { useAuthentifiedUserQuery } from '../../utils/functions/getAuthentifiedUser';
import { useEffect, useState } from 'react';

type MessageData = {
  function: 'new-messages' | 'message-sent';
};

type NewMessagesMessageData = {
  function: 'new-messages';
  data: {
    messages: Array<{
      details: {
        id: string;
        user_id: string;
        message: string;
        creation_time: string;
        status_code: string;
        attachments: string;
        first_name: string;
        last_name: string;
        profile_image: string;
        user_type: string;
        full_name: string;
      };
    }>;
  };
};

const isNewMessagesMessageData = (data: MessageData): data is NewMessagesMessageData => {
  return (
    data.function === 'new-messages' &&
    'data' in data &&
    !!data.data &&
    typeof data.data === 'object' &&
    'messages' in data.data &&
    Array.isArray(data.data.messages) &&
    data.data.messages.every(
      (message) =>
        !!message &&
        typeof message === 'object' &&
        'details' in message &&
        typeof message.details === 'object' &&
        'id' in message.details &&
        typeof message.details.id === 'string' &&
        'user_id' in message.details &&
        typeof message.details.user_id === 'string' &&
        'message' in message.details &&
        typeof message.details.message === 'string' &&
        'creation_time' in message.details &&
        typeof message.details.creation_time === 'string' &&
        'status_code' in message.details &&
        typeof message.details.status_code === 'string' &&
        'attachments' in message.details &&
        typeof message.details.attachments === 'string' &&
        'first_name' in message.details &&
        typeof message.details.first_name === 'string' &&
        'last_name' in message.details &&
        typeof message.details.last_name === 'string' &&
        'profile_image' in message.details &&
        typeof message.details.profile_image === 'string' &&
        'user_type' in message.details &&
        typeof message.details.user_type === 'string' &&
        'full_name' in message.details &&
        typeof message.details.full_name === 'string',
    )
  );
};

export default function AppViewChatWebsocketComponent() {
  const navigate = useNavigate();

  const { data: authentifiedUser } = useAuthentifiedUserQuery();
  const [pingInterval, setPingInterval] = useState<ReturnType<typeof setInterval>>();

  const { data: chatLink } = useQuery({
    ...queries['external-link'].list._ctx.byArchiveState(false),
    select: (data) => data.find((d) => d.title === 'Chat Vizeo'),
    enabled: authentifiedUser.userInfo.roles.includes('ROLE_MEMBRE_VIZEO'),
  });

  const { sendMessage, readyState } = useWebSocket(
    CHAT_WEBSOCKET_URL,
    {
      onOpen: () => {
        console.log('Chat websocket connected');
      },
      onClose: () => {
        console.log('Chat websocket closed');
        if (pingInterval) {
          clearInterval(pingInterval);
          setPingInterval(undefined);
        }
      },
      onError: (error) => {
        console.log('Chat websocket error', error);
      },
      onMessage: (message) => {
        try {
          const data = JSON.parse(message.data) as MessageData;
          if (
            isNewMessagesMessageData(data) &&
            data.data.messages.length === 1 &&
            !['bot', 'admin', 'agent'].includes(data.data.messages[0].details.user_type)
          ) {
            let toastMessage = 'Un utilisateur a envoyé un nouveau message sur le chat VIZEO';
            if (data.data.messages[0].details.message.length > 0)
              toastMessage += ` :\n${
                data.data.messages[0].details.message.length > 150
                  ? data.data.messages[0].details.message.substring(0, 150) + '...'
                  : data.data.messages[0].details.message
              }`;
            else if (data.data.messages[0].details.attachments.length > 0) toastMessage += ' contenant une ou plusieurs pièces jointes.';
            else {
              console.error('New message does not include message and content.', data);
              return;
            }
            toast.info(toastMessage, {
              style: {
                whiteSpace: 'pre-line',
                cursor: chatLink ? 'pointer' : 'default',
              },
              autoClose: false,
              onClick: chatLink
                ? () =>
                    navigate({
                      to: '/app/external-links/$externalLinkId',
                      params: { externalLinkId: chatLink.id },
                    })
                : undefined,
            });
          }
        } catch (err) {
          console.error('error while parsing message from chat websocket server', err);
        }
      },
    },
    authentifiedUser.userInfo.roles.includes('ROLE_MEMBRE_VIZEO'),
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
