import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../../../components/SendEmailModal/SendEmailModal';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';

const routeApi = getRouteApi('/app/tools/emails/$emailId/reply');

export default function AppViewToolsViewEmailsViewEmailModalViewReplyModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { emailId } = routeApi.useParams();

  const { data: email } = useSuspenseQuery(queries.emails.detail(emailId));

  return <SendEmailModalComponent isOpen={true} onClose={() => navigate({ to: '..', search: (old) => old, resetScroll: false })} emailToReply={email} />;
}
