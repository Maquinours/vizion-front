import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../components/SendEmailModal/SendEmailModal';
import { queries } from '../../../../../../utils/constants/queryKeys';

const routeApi = getRouteApi('/app/enterprises/send-email-to-contact/$contactId');

export default function AppViewEnterprisesViewSendEmailToContactModalView() {
  const navigate = routeApi.useNavigate();

  const { contactId } = routeApi.useParams();

  const { data: contact } = useSuspenseQuery(queries.profiles.detail._ctx.byId(contactId));

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  return <SendEmailModalComponent isOpen={true} defaultRecipient={[contact.email!]} onClose={onClose} />;
}
