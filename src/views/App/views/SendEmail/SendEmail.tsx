import { getRouteApi, useNavigate } from '@tanstack/react-router';
import SendEmailComponent from '../../../../components/SendEmail/SendEmail';
const Route = getRouteApi('/app/emails/send');

export default function SendEmailView() {
  const navigate = useNavigate();

  const { sendEmailModal: modal } = Route.useSearch();

  return (
    <SendEmailComponent
      showPredefinedMessagesModal={modal === 'predefined-messages'}
      openPredefinedMessagesModal={() => navigate({ from: Route.id, search: (old) => ({ ...old, sendEmailModal: 'predefined-messages' }) })}
      closePredefinedMessagesModal={() => navigate({ from: Route.id, search: (old) => ({ ...old, sendEmailModal: undefined }) })}
    />
  );
}
