import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import SendEmailModalComponent from '../../../../../../../../../../components/SendEmailModal/SendEmailModal';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';

const routeApi = getRouteApi('/app/tools/emails/$emailId/reply');

export default function AppViewToolsViewEmailsViewEmailModalViewReplyModalView() {
  const navigate = routeApi.useNavigate();

  const { emailId } = routeApi.useParams();

  const { data: email } = useSuspenseQuery(queries.emails.detail(emailId));

  return (
    <SendEmailModalComponent
      isOpen={true}
      onClose={() => navigate({ to: '..', search: (old) => old, replace: true, resetScroll: false })}
      emailToReply={email}
    />
  );
}
