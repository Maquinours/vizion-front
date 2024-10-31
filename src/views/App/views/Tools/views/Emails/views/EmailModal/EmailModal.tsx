import { getRouteApi } from '@tanstack/react-router';
import EmailModalComponent from '../../../../../../../../components/EmailModal/EmailModal';

const routeApi = getRouteApi('/app/tools/emails/$emailId');

export default function AppViewToolsViewEmailsViewEmailModalView() {
  const navigate = routeApi.useNavigate();

  const { emailId } = routeApi.useParams();

  return (
    <EmailModalComponent
      onClose={() => navigate({ to: '..', search: (old) => old, replace: true, resetScroll: false })}
      emailId={emailId}
      replyLink={{ to: '/app/tools/emails/$emailId/reply', params: { emailId }, search: (old) => old, replace: true, resetScroll: false }}
    />
  );
}
