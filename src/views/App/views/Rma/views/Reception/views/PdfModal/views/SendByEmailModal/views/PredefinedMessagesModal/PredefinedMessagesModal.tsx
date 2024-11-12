import { getRouteApi } from '@tanstack/react-router';
import SendEmailPredefinedMessagesModalComponent from '../../../../../../../../../../../../components/SendEmailPredefinedMessagesModal/SendEmailPredefinedMessagesModal';

const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/reception/pdf/send-by-email/predefined-messages');

export default function AppViewRmaViewReceptionViewPdfModalViewSendByEmailModalViewPredefinedMessagesModalView() {
  const navigate = routeApi.useNavigate();

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  return <SendEmailPredefinedMessagesModalComponent onClose={onClose} />;
}
