import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'react-toastify';
import useWebSocket from 'react-use-websocket';
import { CHAT_WEBSOCKET_URL } from '../../../../utils/constants/api';
import { queries } from '../../../../utils/constants/queryKeys';
import { useAuthentifiedUserQuery } from '../../utils/functions/getAuthentifiedUser';

type MessageData = {
  function: 'new-message' | 'message-sent';
};

type NewMessageMessageData = {
  function: 'new-message';
  data: Array<{
    details: {
      attachments: string;
      creation_time: string;
      first_name: string;
      full_name: string;
      id: string;
      last_name: string;
      message: string;
      profile_image: string;
      status_code: string;
      user_id: string;
      user_type: string;
    };
  }>;
};

const isNewMessage = (data: MessageData): data is NewMessageMessageData => data.function === 'new-message';

export default function AppViewChatWebsocketComponent() {
  const navigate = useNavigate();

  const { data: authentifiedUser } = useAuthentifiedUserQuery();

  const { data: chatLink } = useQuery({
    ...queries['external-link'].list._ctx.byArchiveState(false),
    select: (data) => data.find((d) => d.title === 'Chat Vizeo'),
    enabled: authentifiedUser.userInfo.roles.includes('ROLE_VIZEO'),
  });

  useWebSocket(
    CHAT_WEBSOCKET_URL,
    {
      onOpen: () => {
        console.log('Chat websocket connected');
      },
      onClose: () => {
        console.log('Chat websocket closed');
      },
      onError: (error) => {
        console.log('Chat websocket error', error);
      },
      onMessage: (message) => {
        try {
          const data = JSON.parse(message.data) as MessageData;
          if (isNewMessage(data) && data.data.length === 1 && !['bot', 'admin', 'agent'].includes(data.data[0].details.user_type)) {
            let toastMessage = 'Un utilisateur a envoyé un nouveau message sur le chat VIZEO';
            if (data.data[0].details.message.length > 0)
              toastMessage += ` :\n${
                data.data[0].details.message.length > 150 ? data.data[0].details.message.substring(0, 150) + '...' : data.data[0].details.message
              }`;
            else if (data.data[0].details.attachments.length > 0) toastMessage += ' contenant une ou plusieurs pièces jointes.';
            else {
              console.error('New message does not include message and content.', data);
              return;
            }
            toast.info(toastMessage, {
              style: {
                whiteSpace: 'pre-line',
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
    authentifiedUser.userInfo.roles.includes('ROLE_VIZEO'),
  );

  return null;
}
