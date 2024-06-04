import { getRouteApi, useNavigate } from '@tanstack/react-router';
import SendEmailPredefinedMessagesModalComponent from '../../../../../../../../../../../../components/SendEmailPredefinedMessagesModal/SendEmailPredefinedMessagesModal';

const routeApi = getRouteApi('/app/businesses-rma/rma/$rmaId/reception/pdf/send-by-email/predefined-messages');

export default function AppViewRmaViewReceptionViewPdfModalViewSendByEmailModalViewPredefinedMessagesModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  return <SendEmailPredefinedMessagesModalComponent onClose={onClose} />;
}
