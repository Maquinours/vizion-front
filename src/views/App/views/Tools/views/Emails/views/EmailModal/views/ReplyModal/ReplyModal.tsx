import { useNavigate } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../../../components/SendEmailModal/SendEmailModal';
import { useSuspenseQuery } from '@tanstack/react-query';
import { emailQueryKeys } from '../../../../../../../../../../utils/constants/queryKeys/email';
import { getEmailById } from '../../../../../../../../../../utils/api/email';

const routeApi = getRouteApi('/app/tools/emails/$emailId/reply');

export default function AppViewToolsViewEmailsViewEmailModalViewReplyModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { emailId } = routeApi.useSearch();

  const { data: email } = useSuspenseQuery({
    queryKey: emailQueryKeys.detailById(emailId),
    queryFn: () => getEmailById(emailId),
  });

  return <SendEmailModalComponent isOpen={true} onClose={() => navigate({ to: '..', search: (old) => old })} emailToReply={email} />;
}
