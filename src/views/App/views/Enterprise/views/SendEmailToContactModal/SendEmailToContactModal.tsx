import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../components/SendEmailModal/SendEmailModal';
import { queries } from '../../../../../../utils/constants/queryKeys';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId/send-email-to-contact/$contactId');

export default function AppViewEnterpriseViewSendEmailToContactModalView() {
  const navigate = routeApi.useNavigate();

  const { contactId } = routeApi.useParams();

  const { data: contact } = useSuspenseQuery(queries.profiles.detail._ctx.byId(contactId));

  return (
    <SendEmailModalComponent
      isOpen={true}
      onClose={() => navigate({ to: '../..', search: true, replace: true, resetScroll: false })}
      defaultRecipient={[contact.email!]}
    />
  );
}
