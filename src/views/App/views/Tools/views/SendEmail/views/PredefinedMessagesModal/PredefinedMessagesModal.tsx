import { getRouteApi, useNavigate } from '@tanstack/react-router';
import SendEmailPredefinedMessagesModalComponent from '../../../../../../../../components/SendEmailPredefinedMessagesModal/SendEmailPredefinedMessagesModal';

const routeApi = getRouteApi('/app/tools/emails/send/predefined-messages');

export default function AppViewToolsViewSendEmailViewPredefinedMessagesModalView() {
  const navigate = useNavigate();

  return <SendEmailPredefinedMessagesModalComponent onClose={() => navigate({ from: routeApi.id, to: '..' })} />;
}
