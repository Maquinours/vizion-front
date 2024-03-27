import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { profileQueryKeys } from '../../../../../../utils/constants/queryKeys/profile';
import { getProfileById } from '../../../../../../utils/api/profile';
import SendEmailModalComponent from '../../../../../../components/SendEmailModal/SendEmailModal';

const routeApi = getRouteApi('/app/enterprises/$enterpriseId/send-email-to-contact/$contactId');

export default function AppViewEnterpriseViewSendEmailToContactModalView() {
  const navigate = useNavigate();

  const { contactId } = routeApi.useParams();

  const { data: contact } = useSuspenseQuery({
    queryKey: profileQueryKeys.detailById(contactId),
    queryFn: () => getProfileById(contactId),
  });

  return (
    <SendEmailModalComponent
      isOpen={true}
      onClose={() => navigate({ from: routeApi.id, to: '../..', search: (old) => old })}
      defaultRecipient={[contact.email!]}
    />
  );
}
