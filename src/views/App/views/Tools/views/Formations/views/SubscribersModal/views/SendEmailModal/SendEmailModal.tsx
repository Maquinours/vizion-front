import { getRouteApi, useNavigate } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../../../components/SendEmailModal/SendEmailModal';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';

const routeApi = getRouteApi('/app/tools/formations/subscribers/$formationDetailId/send-email/$subscriptionId');

export default function AppViewToolsViewFormationsViewSubscribersModalViewSendEmailModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { subscriptionId } = routeApi.useParams();

  const { data: subscription } = useSuspenseQuery(queries['formation-subscriptions'].detail._ctx.byId(subscriptionId));

  const onClose = () => {
    navigate({ to: '../..', search: (old) => old, replace: true });
  };

  return <SendEmailModalComponent isOpen={true} onClose={onClose} defaultRecipient={[subscription.email!]} />;
}
