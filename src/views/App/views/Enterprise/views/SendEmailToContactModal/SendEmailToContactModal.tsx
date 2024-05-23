import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../components/SendEmailModal/SendEmailModal';
import { queries } from '../../../../../../utils/constants/queryKeys';

const routeApi = getRouteApi('/app/enterprises/$enterpriseId/send-email-to-contact/$contactId');

export default function AppViewEnterpriseViewSendEmailToContactModalView() {
  const navigate = useNavigate();

  const { contactId } = routeApi.useParams();

  const { data: contact } = useSuspenseQuery(queries.profiles.detail(contactId));

  return (
    <SendEmailModalComponent
      isOpen={true}
      onClose={() => navigate({ from: routeApi.id, to: '../..', search: (old) => old, replace: true })}
      defaultRecipient={[contact.email!]}
    />
  );
}
