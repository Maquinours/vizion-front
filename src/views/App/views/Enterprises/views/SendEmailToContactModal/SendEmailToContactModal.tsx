import { getRouteApi, useNavigate } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../components/SendEmailModal/SendEmailModal';
import { useSuspenseQuery } from '@tanstack/react-query';
import { profileQueryKeys } from '../../../../../../utils/constants/queryKeys/profile';
import { getProfileById } from '../../../../../../utils/api/profile';

const routeApi = getRouteApi('/app/enterprises/send-email-to-contact/$contactId');

export default function AppViewEnterprisesViewSendEmailToContactModalView() {
  const navigate = useNavigate();

  const { contactId } = routeApi.useParams();

  const { data: contact } = useSuspenseQuery({
    queryKey: profileQueryKeys.detailById(contactId),
    queryFn: () => getProfileById(contactId),
  });

  const onClose = () => {
    navigate({ from: routeApi.id, to: '../..', search: (old) => old });
  };

  return <SendEmailModalComponent isOpen={true} defaultRecipient={[contact.email!]} onClose={onClose} onEmailSent={onClose} />;
}
