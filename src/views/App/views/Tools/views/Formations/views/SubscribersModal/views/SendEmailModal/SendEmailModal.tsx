import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../../../components/SendEmailModal/SendEmailModal';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';

const routeApi = getRouteApi('/app/tools/formations/subscribers/$formationDetailId/send-email/$subscriptionId');

export default function AppViewToolsViewFormationsViewSubscribersModalViewSendEmailModalView() {
  const navigate = routeApi.useNavigate();

  const { subscriptionId } = routeApi.useParams();

  const { data: subscription } = useSuspenseQuery(queries['formation-subscriptions'].detail._ctx.byId(subscriptionId));

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  return <SendEmailModalComponent isOpen={true} onClose={onClose} defaultRecipient={[subscription.email!]} />;
}
