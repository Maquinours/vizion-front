import { getRouteApi, useNavigate } from '@tanstack/react-router';
import EmailModalComponent from '../../../../../../../../components/EmailModal/EmailModal';

const routeApi = getRouteApi('/app/tools/emails/$emailId');

export default function AppViewToolsViewEmailsViewEmailModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { emailId } = routeApi.useParams();

  return (
    <EmailModalComponent
      onClose={() => navigate({ to: '..', search: (old) => old, replace: true, resetScroll: false })}
      emailId={emailId}
      replyLink={{ to: '/app/tools/emails/$emailId/reply', params: { emailId }, search: (old) => old, replace: true, resetScroll: false }}
    />
  );
}
