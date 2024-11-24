import { getRouteApi } from '@tanstack/react-router';
import SendEmailPredefinedMessagesModalComponent from '../../../../../../../../../../../../components/SendEmailPredefinedMessagesModal/SendEmailPredefinedMessagesModal';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/quotation/commercial-notice/send-by-email/predefined-messages');

export default function AppViewBusinessViewQuotationViewCommercialNoticeModalViewSendByEmailModalViewPredefinedMessagesModalView() {
  const navigate = routeApi.useNavigate();

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false, ignoreBlocker: true });
  };

  return <SendEmailPredefinedMessagesModalComponent onClose={onClose} />;
}
