import { useSubscription } from 'react-stomp-hooks';
import ProfileInfoResponseDto from '../../../../../../utils/types/ProfileInfoResponseDto';

type Props = Readonly<{
  user: ProfileInfoResponseDto;
  refetch: () => void;
}>;
export default function AppViewTitleManagerComponentWebsocketComponent({ user, refetch }: Props) {
  useSubscription([`/topic/tasks-sender/${user.profile.id}`, `/topic/tasks/${user.profile.id}`], () => refetch());
  return null;
}
