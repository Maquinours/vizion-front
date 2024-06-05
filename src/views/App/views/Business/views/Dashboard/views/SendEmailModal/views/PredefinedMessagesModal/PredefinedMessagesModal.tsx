import { getRouteApi } from '@tanstack/react-router';
import SendEmailPredefinedMessagesModalComponent from '../../../../../../../../../../components/SendEmailPredefinedMessagesModal/SendEmailPredefinedMessagesModal';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/dashboard/send-email/predefined-messages');

export default function AppViewBusinessViewDashboardViewSendEmailModalViewPredefinedMessagesModalView() {
  const navigate = routeApi.useNavigate();

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  return <SendEmailPredefinedMessagesModalComponent onClose={onClose} />;
}