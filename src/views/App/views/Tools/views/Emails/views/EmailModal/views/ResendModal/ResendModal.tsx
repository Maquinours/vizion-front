import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import ResendEmailModalComponent from '../../../../../../../../../../components/ResendEmailModal/ResendEmailModal';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';

const routeApi = getRouteApi('/app/tools/emails/$emailId/resend');

export default function AppViewToolsViewEmailsViewEmailModalViewResendModalView() {
  const navigate = routeApi.useNavigate();

  const { emailId } = routeApi.useParams();

  const { data: email } = useSuspenseQuery(queries.emails.detail(emailId));

  return <ResendEmailModalComponent isOpen onClose={() => navigate({ to: '..', search: true, replace: true, resetScroll: false })} email={email} />;
}
