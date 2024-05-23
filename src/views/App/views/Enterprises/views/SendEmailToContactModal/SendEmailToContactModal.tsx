import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../components/SendEmailModal/SendEmailModal';
import { queries } from '../../../../../../utils/constants/queryKeys';

const routeApi = getRouteApi('/app/enterprises/send-email-to-contact/$contactId');

export default function AppViewEnterprisesViewSendEmailToContactModalView() {
  const navigate = useNavigate();

  const { contactId } = routeApi.useParams();

  const { data: contact } = useSuspenseQuery(queries.profiles.detail(contactId));

  const onClose = () => {
    navigate({ from: routeApi.id, to: '../..', search: (old) => old });
  };

  return <SendEmailModalComponent isOpen={true} defaultRecipient={[contact.email!]} onClose={onClose} />;
}
